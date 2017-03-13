var express= require('express');
var app= express();
var http= require('http');

var server = http.createServer(app);
var io = require('socket.io').listen(server);

var users=[];
var connections=[];
app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
});
io.sockets.on('connection', function(socket){
 
  connections.push(socket);
     console.log('a user connected. Total connections : '+connections.length);
    
  socket.on('disconnect', function(){
      users.splice(users.indexOf(socket.username),1);
      updateUserNames(); 
      connections.splice(connections.indexOf(socket),1);
    console.log('user disconnected..Total connections : '+connections.length);
  });
    
    socket.on('send message', function(data){
        
      io.sockets.emit('new message', {msg:data,username:socket.username}); 
    });
    
    
    socket.on('new user', function(data,cb){
       cb(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });
    
    function updateUserNames(){
       io.sockets.emit('get users', users);
    }
    
});
server.listen(3000);
console.log("server is running");
