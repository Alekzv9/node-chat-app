//Initialize the request to open up a websocket
var socket = io(); //By default it connect to localhost

//Change arrow function for regular functions to work in
//in a wide range of browsers

//If the server shutdown will keep trying to reconnect
socket.on('connect', function () {
    console.log('Connected');

    // socket.emit('createEmail', {
    //     to: 'email@email.com',
    //     text: 'Hey mail test'
    // });

    socket.emit('createMessage', {
        from: 'Client',
        message: 'Message from client'
    });
});

// socket.on('newEmail', function (email) {
//     console.log(email);
// });

socket.on('newMessage', function(message) {
    console.log(message);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});
