var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var participants = {};
app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/app/chat.html');
});

/*app.get('/notices', function(req, res){
  res.sendFile(__dirname + '/app/index.html');
});*/

io.on('connection', function(socket)
{
  socket.on('chat message', function(msg){
    io.sockets.emit('chat message', {username : msg.username, message : msg.message, dateTime : msgTimeStamp()});
	if(msg.message) console.log(msg.username + " said " + msg.message);
  });
  
  socket.on('disconnect', function(){
	if(Object.keys(participants).length > 0){
		io.sockets.emit('left', {userLeft : participants[socket.id]});
		console.log(participants[socket.id] + ' disconnected');
		delete participants[socket.id];
	}
	console.log(socket.id + ' disconnected');
  });
  
  socket.on('noticemsg', function(msg){
	console.log('Event Title: ' + msg.eventTitle + ',\nNotice Type: ' + msg.noticeType + ',\nMessage: ' + msg.noticeMsg + ',\nLocation: ' + msg.eventlocation + ',\nEvent Date: ' + msg.eventDate + "\n");
	io.sockets.emit('noticemsg', msg);
  });
});
  
io.on('connection', function(socket)
{
  socket.on('join', function(msg){
	io.sockets.emit('join', {username : msg.username, dateTime : msgTimeStamp()});
	participants[socket.id] = msg.username;
	console.log("socket ID user " + participants[socket.id]);
  });
});

http.listen(app.get('port'), function(){
  console.log('listening on *:' + app.get('port'));
});

function msgTimeStamp()
{
	var dateTime = new Date();
	var timeStamp = "(" + dateTime.getHours() + ":" + dateTime.getMinutes() + ") ";
	return timeStamp;
}