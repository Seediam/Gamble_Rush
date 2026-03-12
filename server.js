const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Permite que seu RPG se conecte de qualquer lugar
        methods: ["GET", "POST"]
    }
});

// Mapeia quem está em qual sala de chamada
io.on('connection', (socket) => {
    console.log('Dispositivo conectado:', socket.id);

    // Jogador entra em uma sala de chamada privada (baseada no ID da ligação)
    socket.on('join_call', (callId) => {
        socket.join(callId);
        console.log(`Jogador ${socket.id} entrou na sala: ${callId}`);
    });

    // Recebe o pacote de áudio e envia APENAS para a outra pessoa na sala
    socket.on('stream_audio', (data) => {
        // data.callId: ID da sala
        // data.audio: O binário do áudio
        // data.sender: Quem enviou
        socket.to(data.callId).emit('receber_audio', {
            audio: data.audio,
            sender: data.sender
        });
    });

    socket.on('disconnect', () => {
        console.log('Jogador desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor de Voz rodando na porta ${PORT}`);
});
