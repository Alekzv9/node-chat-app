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

//WS are persistence technoloigie, client and server persist the communication
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('Client was disconnected');
    });
});

server.listen(port, () => {
    console.log('Server started on port ' + port);
});