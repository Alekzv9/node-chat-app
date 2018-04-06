const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer((app));
var io = socketIO(server);


app.use(express.static(publicPath));

//WS are persistence technologies, client and server persist the communication
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message) => {
        console.log('createMessage', message);
        //Send to everybody (even me)
        io.emit('newMessage', generateMessage(message.from, message.text));

        //Send to everybody but myself
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });
});

server.listen(port, () => {
    console.log('Server started on port ' + port);
});