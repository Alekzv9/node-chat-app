const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer((app));
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

//WS are persistence technologies, client and server persist the communication
io.on('connection', (socket) => {
    console.log('New user connected');

    //Send to everybody but me
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required');
        } else {
            socket.join(params.room);
            //remove if already exists
            users.removeUser(socket.id);
            users.addUser(socket.id, params.name, params.room);
            //socket.leave('NameOfRoom');

            io.to(params.room).emit('updateUserList', users.getUserList(params.room));
            socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
            socket.
                broadcast
                .to(params.room)
                .emit('newMessage',
                    generateMessage('Admin', `${params.name} has joined`));

            callback();
        }
    });

    //callback: acknowledgment
    socket.on('createMessage', (message, callback) => {
        // console.log('createMessage', message);
        //Send to everybody (even me)
        let user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        const user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit(
                'newLocationMessage',
                generateLocationMessage(user.name, coords.latitude, coords.longitude)
            );
        }
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
        console.log('User was disconnected');
    });
});

server.listen(port, () => {
    console.log('Server started on port ' + port);
});