//Initialize the request to open up a websocket
var socket = io(); //By default it connect to localhost

function scrollToBottom() {
    //Selectors
    const messages = $('#messages');
    const newMessage = messages.children('li:last-child');
    //Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        console.log('Should scroll');
        messages.scrollTop(scrollHeight);
    }
}

//Change arrow function for regular functions to work in
//in a wide range of browsers

//If the server shutdown will keep trying to reconnect
socket.on('connect', function () {
    const params = $.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    });
});

socket.on('updateUserList', function (users) {
    const ol = $('<ol></ol>');
    users.forEach(function (u) {
        ol.append($('<li></li>').text(u));
    });

    $('#users').append(ol)
});

socket.on('newMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
    // let li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // $('#messages').append(li);
});

// socket.emit('createMessage', {
//     from: 'User',
//     text: 'User message'
// }, function (message) {
//     console.log('Got it.', message);
// });

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('newLocationMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = $('#location-message-template').html();
    const html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
    // let li = $('<li></li>');
    // var a = $('<a target="_blank">My current location</a>');
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
    // $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    var messageTextBox = $('#message');

    socket.emit('createMessage', {
        text: messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    });
});

var locationButton = $('#send-location');
locationButton.on('click', function (e) {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});