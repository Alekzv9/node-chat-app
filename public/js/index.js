//Initialize the request to open up a websocket
var socket = io(); //By default it connect to localhost

//Change arrow function for regular functions to work in
//in a wide range of browsers

//If the server shutdown will keep trying to reconnect
socket.on('connect', function () {
    console.log('Connected');
});

socket.on('newMessage', function (message) {
    //console.log(message);
    let li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
});

socket.emit('createMessage', {
    from: 'User',
    text: 'User message'
}, function (message) {
    console.log('Got it.', message);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from: 'User',
        text: $('#message').val()
    }, function () {

    });
});