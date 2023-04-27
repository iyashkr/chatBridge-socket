const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const env = require("./env")
const axios = require('axios')


const server = http.createServer();
const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const onlineFriends = [];

io.on('connection', (socket) => {
    socket.on('userconnected', (user) => {
        if (!onlineFriends.includes(user.id)) {
            onlineFriends.push(user.id);
            io.emit('onlineusers', onlineFriends);
        }
    });
    socket.on('disconnected', (user) => {
        const index = onlineFriends.indexOf(user?.id);
        if (index !== -1) {
            onlineFriends.splice(index, 1);
        }
    });
    socket.on('joinroom', (conversationId) => {
        socket.join(conversationId);
    });
    socket.on('sendmessage', (message) => {
        socket.to(message?.conversationId).emit('newmessage', message); // emit the newmessage event with the message data to the client
    });

});


// start server
server.listen(5000, () => {
    console.log('Server started');
});
