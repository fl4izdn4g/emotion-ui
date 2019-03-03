var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(7777);

app.use(express.static('static'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('ai', function (data) {
    if(data) { 
        console.log(data);
        io.emit('ai', data);
    }
  });
});