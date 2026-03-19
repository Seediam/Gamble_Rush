const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, ''))); 

// Dicionário na memória do servidor para lembrar "Quem é Quem"
const playersOnline = {};

io.on("connection", (socket) => {
    
    // NOVO: Quando o cara faz login, o site avisa quem ele é!
    socket.on("registrarJogador", (playerName) => {
        playersOnline[socket.id] = playerName;
        console.log(`🟢 [LOGIN] O jogador ${playerName} conectou no servidor!`);
    });

    socket.on("joinMap", (mapKey) => {
        // Puxa o nome da memória do servidor
        let playerName = playersOnline[socket.id] || "Alguém Desconhecido"; 
        
        Array.from(socket.rooms).forEach(room => {
            if (room !== socket.id) socket.leave(room);
        });
        socket.join(mapKey);
        console.log(`📍 [${playerName}] abriu o mapa: ${mapKey}`);
    });

    socket.on("moverToken", (data) => {
        let player = playersOnline[socket.id] || "Alguém";
        console.log(`🚶 [${player}] se moveu no mapa ${data.mapKey}`);
        socket.to(data.mapKey).emit("tokenMovido", data);
    });

    socket.on("passarTurno", (data) => {
        let player = playersOnline[socket.id] || "Alguém";
        let vezDeQuem = data.novoTurno.ordem[data.novoTurno.atual];
        console.log(`⏳ [TURNO] [${player}] passou a vez. Agora joga: ${vezDeQuem}`);
        io.to(data.mapKey).emit("turnoPassado", data);
    });

    socket.on("attackEvent", (data) => {
        let player = playersOnline[socket.id] || "Alguém";
        if(data.events && data.events.length > 0) {
            let atk = data.events[0];
            let alvos = atk.targets.join(", ");
            console.log(`⚔️ [${player}] usou [${atk.weaponName}] contra [${alvos}]! (Dado: ${atk.atkRoll})`);
        }
        io.to(data.mapKey).emit("receberAtaque", data);
    });

    socket.on("clashEvent", (data) => {
        let clash = data.clashData;
        if(clash.isHeal) {
            console.log(`💚 [${clash.atkName}] curou/buffou [${clash.defName}] -> Efeito: +${clash.dmg}`);
        } else {
            console.log(`💥 [CLASH] ${clash.atkName} vs ${clash.defName} -> Dano: ${clash.dmg} (${clash.resultText})`);
        }
        io.to(data.mapKey).emit("receberClash", data);
    });

    socket.on("disconnect", () => {
        let player = playersOnline[socket.id];
        if(player) {
            console.log(`🔴 [LOGOUT] ${player} fechou o jogo.`);
            delete playersOnline[socket.id]; // Limpa a memória
        }
    });
});

server.listen(3000, () => {
    console.log("🔥 Servidor Gumble Rush rodando com LOGS DE COMBATE na porta 3000!");
});
