var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/app/chat.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.sockets.emit('chat message', {username : msg.username, message : msg.message});
	if(msg.message) console.log(msg.username + " said " + msg.message);
  });
});

io.on('connection', function(socket){
  socket.on('join', function(msg){
	io.sockets.emit('join', {username : msg.username});
	console.log(msg.username + " username");
  });
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:3000');
});