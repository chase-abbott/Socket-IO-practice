const express = require('express');
const dotenv = require('dotenv');
const socketIO = require('socket.io');

const INDEX = '/index.html';
const PORT = process.env.port || 3000;

dotenv.config();

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(server)

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  })
});
