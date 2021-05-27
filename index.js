
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
    // origin: 'https://mystifying-bardeen-9951c5.netlify.app',
    
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
let interval = 3000;
let userIndex = 0;
let seconds = 20;
let draftTime = 20;
let numberOfPlayers = 3;

let messages = []
io.on('connection', (socket) => {
  console.log('connected');

  socket.on('logged-in', user => {
     
    users.push(user);
    console.log(users);
    io.emit('logged-in', users);

    if (users.length === numberOfPlayers) {
      users.push('');
      console.log('timer started');
      let myInterval = setInterval(() => {
       
        seconds--;
        // let currentPlayer = currentPlayerArray(users[userIndex], userOneDrafted, userTwoDrafted, userThreeDrafted)
        
        
        // console.log(users[userIndex].userId, userOneDrafted)
        // console.log(users[userIndex])
        io.emit('start', users[userIndex], draftTime, seconds);
        // if ( seconds === 0){ 
        //   console.log('next player')
        //   // userIndex++;
        //   seconds = draftTime;
        //   // io.emit('change', draftedPlayers);
          if (draftedPlayers.length === 30) {
            console.log(draftedPlayers.length)
            clearInterval(myInterval); 
            //workaround to not have list displayed after last player turn
            console.log(userOneDrafted.length, userTwoDrafted.length, userThreeDrafted.length)
            io.emit('current-user', '');
            users = [];
            userIndex = 0;
            draftedPlayers = [];
            userOneDrafted = [];
            userTwoDrafted = [];
            userThreeDrafted = [];
            io.emit('end-draft');
          }
        // }
      }, interval);
    }
  });   

  socket.on('state-change', (change, players) => {
    // console.log(change);
    draftedPlayers.push(change);
    if (users[0]) userOneDrafted = getUserOneDrafted(users, draftedPlayers);
    if (users[1]) userTwoDrafted = getUserTwoDrafted(users, draftedPlayers);
    if (users[2]) userThreeDrafted = getUserThreeDrafted(users, draftedPlayers);
    io.emit('state-change', players, draftedPlayers, userOneDrafted, userTwoDrafted, userThreeDrafted);
    console.log(userIndex)
  
      userIndex ++

      if(userIndex === 3) {
        userIndex = 0
      }
    
    
  });
 
  socket.on('chat-message', (msg) => {
    messages = [...messages, msg]
    console.log(messages)
    io.emit('chat-message', messages);  
  });

  // console.log(users)
  socket.on('disconnect', () => {
    console.log('disconnected');
    console.log(users);
  });


});

function currentPlayerArray(user, playerOneDrafted, playerTwoDrafted, playerThreeDrafted) {

  if( playerOneDrafted.length > 0 &&  playerOneDrafted[0].userId === user.userId) {
    return playerOneDrafted
  } else if (playerTwoDrafted.length > 0 &&  playerTwoDrafted[0].userId === user.userId){
    return playerTwoDrafted
  } else if (playerThreeDrafted.length > 0 &&  playerThreeDrafted[0].userId === user.userId){
    return playerThreeDrafted
  }
}


function getUserOneDrafted(users, draftedPlayers){
  const userOneDrafted = draftedPlayers.filter(player => {
    return player.userId === users[0].userId;
  });
  return userOneDrafted;
}
function getUserTwoDrafted(users, draftedPlayers){
  const userTwoDrafted = draftedPlayers.filter(player => {
    return player.userId === users[1].userId;
  });
  return userTwoDrafted;
}
function getUserThreeDrafted(users, draftedPlayers){
  const userThreeDrafted = draftedPlayers.filter(player => {
    return player.userId === users[2].userId;
  });
  return userThreeDrafted;
}





// let i = 0;
// let seconds = 0;
// let users;
// let user;
// const clients = []
// io.on('connection', (client) => {
//   clients.push(client.id)
//  client.on('initial', initialUsers => {
//    if (users !== initialUsers) {
//      users = initialUsers
//    }
//    console.log(users)
//    client.emit('currentUser', users[j])
//  })

//   console.log('connected')
//   client.on('subscribeToTimer', (interval) => {
//     console.log(`${client.id} is subscribing to timer with interval `, interval);
//     let myInterval = setInterval(() => {
//       i++
      
//       client.emit('timer', new Date());
//       if(i === 10){ 
//         clearInterval(myInterval)
//         i = 0
//         j++
//         client.emit('currentUser', users[j])
//         client.emit('mess', 'times up')
        
//       }
      
      
//     }, interval);
//   });
//   client.on('something', something => {
//     console.log(something)
//   });
// });
// socket.on('chat message', (msg, user) => {
//   console.log(msg)
//   io.emit('chat message', msg, user);  
// });
// socket.on('change', (change) => {
//   console.log(change)
//   io.emit('change', change)

// })
