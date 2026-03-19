const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path"); // <-- Adicionado para ler as pastas

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 👇 ISSO AQUI FAZ O SEU NODE.JS HOSPEDAR O SEU HTML, CSS E JS!
app.use(express.static(path.join(__dirname, ''))); 

io.on("connection", (socket) => {
    console.log("🟢 Player conectou:", socket.id);

    socket.on("joinMap", (mapKey) => {
        Array.from(socket.rooms).forEach(room => {
            if (room !== socket.id) socket.leave(room);
        });
        socket.join(mapKey);
        console.log(`📍 Player entrou no mapa: ${mapKey}`);
    });

    socket.on("moverToken", (data) => {
        socket.to(data.mapKey).emit("tokenMovido", data);
    });

    socket.on("passarTurno", (data) => {
        io.to(data.mapKey).emit("turnoPassado", data);
    });

    socket.on("attackEvent", (data) => {
        io.to(data.mapKey).emit("receberAtaque", data);
    });

    socket.on("clashEvent", (data) => {
        io.to(data.mapKey).emit("receberClash", data);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Player saiu:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("🔥 Servidor e Site rodando na porta 3000");
});
