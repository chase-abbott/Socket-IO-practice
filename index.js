const express = require('express');
const dotenv = require('dotenv');
// const socketIO = require('socket.io');

// const INDEX = '/index.html';

dotenv.config();
const PORT = process.env.PORT || 3000;

const server = express();

server.listen(PORT, () => console.log(`Listening on ${PORT}`))

// const io = socketIO(server)

// io.on('connection', (socket) => {
//   console.log('Client connected');
//   socket.on('disconnect', () => console.log('Client disconnected'));
//   socket.on('chat message', (msg) => {
//     io.emit('chat message', msg);
//   })
// });
