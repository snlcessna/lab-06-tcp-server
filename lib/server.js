'use strict';
const chatroom = module.exports = exports = {};

const net = require("net");
const server = net.createServer();

const user = require('./user.js');
const socketPool = {};

server.on('connection', (socket) => {


    let date = new Date();
    let epoch = date.getTime();

    socketPool[epoch] = new user(epoch, socket);



    socket.on('data', (buffer) => {
      
      let text = buffer.toString();
      text = text.replace('\r\n', '');

      let newText = text.split(' ');
      if (text.startsWith('@')){

        switch (newText[0]){
          case '@dm':
          let putTogether = newText.splice(2).join(' ');
            for (var prop in socketPool) {
              if (socketPool[prop].nickname === newText[1]) socketPool[prop].sendMessage(`Direct Message from ${socketPool[epoch].nickname} `, putTogether);
            };
            break;
          case '@quit':
            socketPool[epoch].closeSocket();
            socketPool[epoch] = null;

            delete socketPool[epoch];
            break;
          case '@nickname':
            socketPool[epoch].setNickname(newText[1]);
            break;

          case '@list':
            // Kelati code here. Note: i've moved the server start to chatroom.js
            break;
          default:
               // Kelati: can you also add @list to one of these options in text below? finally, can you work the task in the Documentation section of the README? We have to describe our functions and give instructions on the chatroom actions a user can take.
            socketPool[epoch].sendMessage(
              `${text} not a valid command. Your options are as follows:
              @dm <nickname> <message>
              @nickname <new nickname>
              @quit
              `);
        }
      } else {
        for (var prop in socketPool) {
          socketPool[prop].sendMessage(socketPool[epoch].nickname, text);
        }
      }
      console.log('Chat Message: ', buffer.toString());
    });
});

server.on('error', (err => console.log('Error: ', err)));

module.exports = server;
