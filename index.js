
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST']                                                       
  }
});

// restoring state
//socket integeration run on same server but differant port
//checking authentication on socket, send initial authenticate message
//  io.emit('logged in', users1)
dotenv.config();   

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
const users = [];
const draftedPlayers = [];
let userOneDrafted = [];
let userTwoDrafted = [];
let userThreeDrafted = [];
const interval = 1000;
let i = 0;
let j = 0;
const time = 20;
let numberOfPlayers = 3
io.on('connection', (socket) => {

  console.log('connected');
  socket.on('logged-in', user => {
     
    users.push({ user: user, socketId: socket.id });
    console.log(users);
    io.emit('logged-in', users);

    if(users.length === numberOfPlayers) {
      let myInterval = setInterval(() => {
        console.log('timer started')
        j++
        console.log(users[i])
        io.emit('start', users[i], time, j);
          if(j === time){ 
            i++
            j = 0;
            io.emit('change', draftedPlayers)
            if(i === numberOfPlayers)  { clearInterval(myInterval) ;}
            // io.emit('currentUser', users[i])
            // io.emit('mess', 'times up') 

             // clearInterval(myInterval)
            
          }
    }, interval);
     

    }
     
  
  });   

  //timer on start game

  
    
  socket.on('stateChange', change => {
    console.log(change);
    draftedPlayers.push(change);
    if(users[0]) userOneDrafted = getUserOneDrafted(users, draftedPlayers);
    if(users[1]) userTwoDrafted = getUserTwoDrafted(users, draftedPlayers);
    if(users[2]) userThreeDrafted = getUserThreeDrafted(users, draftedPlayers);
    io.emit('stateChange', draftedPlayers, userOneDrafted, userTwoDrafted, userThreeDrafted);

  });

    
  // console.log(users)
 
 

});



function getUserOneDrafted (users, draftedPlayers){
  const userOneDrafted = draftedPlayers.filter(player => {
    return player.userName === users[0].user;
  });
  return userOneDrafted;
}
function getUserTwoDrafted (users, draftedPlayers){
  const userTwoDrafted = draftedPlayers.filter(player => {
    return player.userName === users[1].user;
  });
  return userTwoDrafted;
}
function getUserThreeDrafted (users, draftedPlayers){
  const userThreeDrafted = draftedPlayers.filter(player => {
    return player.userName === users[2].user;
  });
  return userThreeDrafted;
}





// let i = 0;
// let j = 0;
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
