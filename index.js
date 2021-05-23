
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]                                                       
  }
})

dotenv.config();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`))

io.on('connection', (socket) => {
  console.log('connected')
  socket.on('chat message', (msg) => {
    console.log(msg)
    io.emit('chat message', msg);
  });
});
