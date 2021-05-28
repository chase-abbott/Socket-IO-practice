
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
dotenv.config();  
const io = new Server(server, {
  cors: {
    origin: 'https://mystifying-bardeen-9951c5.netlify.app',
    // origin: 'http://localhost:3001',
    methods: ['GET', 'POST']                                                       
  }
});
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


server.listen(PORT, () => console.log(`Listening on ${PORT}`));

let users = [];
let draftedPlayers = [];
let userOneDrafted = [];
let userTwoDrafted = [];
let userThreeDrafted = [];
let interval = 1000;
let userIndex = 0;
let seconds = 30;
let draftTime = 30;
let numberOfPlayers = 3;


let messages = []
io.on('connection', (socket) => {
  console.log('connected');
  
  socket.on('logged-in', user => {
     
    users.push(user);
    console.log(users);
    io.emit('logged-in', users);

    if (users.length === numberOfPlayers) {
      
      console.log('timer started');
      let myInterval = setInterval(() => {
       
        seconds--;
      
        io.emit('start', users[userIndex], draftTime, seconds);
        if (seconds === 0){ 
          console.log('next player')
          
          userIndex++;
          if(userIndex === 3) {
            userIndex = 0
          }
          seconds = draftTime; }
        //   // io.emit('change', draftedPlayers);
          if (draftedPlayers.length === 30) {
            console.log(draftedPlayers.length)
            clearInterval(myInterval);
            console.log(userOneDrafted.length, userTwoDrafted.length, userThreeDrafted.length)
            io.emit('current-user', '');
            users = [];
            userIndex = 0;
            draftedPlayers = [];
            userOneDrafted = [];
            userTwoDrafted = [];
            userThreeDrafted = [];
            messages = [];
            io.emit('end-draft');
          }
      }, interval);
    }
  });   

  socket.on('state-change', (change, players) => {
    // console.log(change);
    draftedPlayers.push(change);
    if (users[0]) userOneDrafted = getUserDrafted(users[0], draftedPlayers);
    if (users[1]) userTwoDrafted = getUserDrafted(users[1], draftedPlayers);
    if (users[2]) userThreeDrafted = getUserDrafted(users[2], draftedPlayers);
    io.emit('state-change', players, draftedPlayers, userOneDrafted, userTwoDrafted, userThreeDrafted);
    console.log(userIndex)
      userIndex ++
      seconds = draftTime
      if(userIndex === 3) {
        userIndex = 0
      }
  });
 
  socket.on('chat-message', (msg) => {
    messages = [...messages, msg]
    let splitMessage = msg.split(':')[1]
    if(splitMessage === ' RESETDRAFT') {
      
      console.log(msg)
      // users = []
      while(draftedPlayers.length < 30) {
        
        draftedPlayers.push(':')
        console.log(draftedPlayers.length)
      }
    }
    console.log(messages)
    io.emit('chat-message', messages);  
  });

  // console.log(users)
  socket.on('disconnect', () => {
    console.log('disconnected');
    console.log(users);
  });


});

// 


function getUserDrafted(user, draftedPlayers){
  const userOneDrafted = draftedPlayers.filter(player => {
    return player.userId === user.userId;
  });
  return userOneDrafted;
}



// function currentPlayerArray(user, playerOneDrafted, playerTwoDrafted, playerThreeDrafted) {

//   //   if( playerOneDrafted.length > 0 &&  playerOneDrafted[0].userId === user.userId) {
//   //     return playerOneDrafted
//   //   } else if (playerTwoDrafted.length > 0 &&  playerTwoDrafted[0].userId === user.userId){
//   //     return playerTwoDrafted
//   //   } else if (playerThreeDrafted.length > 0 &&  playerThreeDrafted[0].userId === user.userId){
//   //     return playerThreeDrafted
//   //   }
//   // }