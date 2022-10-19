
// const express = require('express');
// const app = express();
// const io = require('socket.io');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let port = process.env.PORT || 3000;


const users = {};


app.get('/', (req,res) => {  
    res.sendFile(__dirname + '/index.html');
});

app.get('/style.css', (req,res) => {
    res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', (req,res) => {
    res.sendFile(__dirname + '/script.js');
});

app.get('/bg.jpg', (req,res) => {
    res.sendFile(__dirname + '/bg.jpg');
});

io.on('connection', socket => {

    //send new user-name
    socket.on('send-name', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);

    });

    socket.on('typing', name =>{
        console.log(name);
        socket.broadcast.emit('getTypingStatus', name);
    });

    //send message
    socket.on('send-chat-msg', message =>{
        socket.broadcast.emit('chat-message',{ message : message, name: users[socket.id] });
    });

    //disconnect user
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];

    });
});

server.listen(port, () => {
    console.log("Listening on port" + port);
})

