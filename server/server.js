const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer((app));
var io = socketIO(server);


app.use(express.static(publicPath));

//WS are persistence technologies, client and server persist the communication
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    //Send to everybody but me
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    //callback: acknowledgment
    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        //Send to everybody (even me)
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit(
            'newLocationMessage',
            generateLocationMessage('Admin', coords.latitude, coords.longitude)
        );
    });

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log('Server started on port ' + port);
});