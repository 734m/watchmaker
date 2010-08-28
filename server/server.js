//console.dir({env:process.env, paths:require.paths});

var http = require('http');
var io = require('socket.io');
var app = require('express').createServer();

//
// http
//

app.get('/', function(req, res) {
  res.sendfile('client/index.html');
});

app.get('/*', function(req, res) {
  res.sendfile('client/' + req.params[0]);
});

var port = 8080;
if (process.env['PRODUCTION_ENABLED']) {
  port = 80;
}

app.listen(port);


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
