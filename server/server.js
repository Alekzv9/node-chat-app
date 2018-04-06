const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

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

    // socket.on('createEmail', (newEmail) => {
    //     console.log('CreateEmail', newEmail);
    // })

    // socket.emit('newEmail', {
    //     from: 'email@email.com',
    //     text: 'Test email',
    //     createdAt: 12312
    // });

    socket.on('createMessage', (message) => {
        console.log('CreateMessage', message);
    });

    socket.emit('newMessage', {
        from: 'User1',
        text: 'From server',
        createdAt: 3123
    });
});

server.listen(port, () => {
    console.log('Server started on port ' + port);
});