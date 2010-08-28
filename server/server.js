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

  // connect client
  client.send(JSON.stringify(world.connect(playerId)));

  // process client messages and send responses
  client.on('message', function(message) {
    try {
      client.send(
        JSON.stringify(
          world.process(playerId, JSON.parse(message))
        )
      );
    } catch(x) {
      console.log('ERROR!!');
    }
  });

  // disconnect client
  client.on('disconnect', function() {
    world.disconnect(playerId);
  });
});

console.log('running');
