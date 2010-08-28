console.dir({env:process.env, paths:require.paths});

var http = require('http');
var io = require('/home/node/.node_libraries/socket.io.js');
var app = require('express').createServer();

//
// http
//

app.get('/', function(req, res) {
  res.sendfile('../client/index.html');
});

app.get('/*', function(req, res) {
  res.sendfile('../client/' + req.params[0]);
});

app.listen(8080);


//
// websocket
//

var socket = io.listen(app);

socket.on('connection', function(client) {
  console.log("new connection");
  client.send('hello sucker');

  client.on('message', function(message) {
    console.log("client says:" + message);
  });

  client.on('disconnect', function() {
    console.log("disconnect");
  });
});

console.log('running');
