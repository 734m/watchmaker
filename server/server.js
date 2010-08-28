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

app.listen(parseInt(process.env['PORT']) || 8080);

//
// websocket
//

var world = require('./server/world');
var socket = io.listen(app);

socket.on('connection', function(client) {
  var playerId = client.sessionId;

  world.connect(playerId);

  client.on('message', function(message) {
    world.process(playerId, message);
  });

  client.on('disconnect', function() {
    world.disconnect(playerId);
  });
});

console.log('running');
