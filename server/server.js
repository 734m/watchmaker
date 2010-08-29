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

  // connect client; broadcast player added to all connected clients
  socket.broadcast(
    JSON.stringify(
      world.connect(playerId)
    )
  );

  // send map and players to client that just connected
  client.send(JSON.stringify({name: "set_map", data: world.map.tiles}));
  client.send(JSON.stringify({name: "set_players", data: world.players}));

  // process client messages; broadcast updates to all connected clients
  client.on('message', function(message) {
    try {
      socket.broadcast(
        JSON.stringify(
          world.process(playerId, JSON.parse(message))
        )
      );
    } catch(e) {
      console.log('ERROR!!');
      console.dir(e);
    }
  });

  // disconnect client; broadcast player deletion to all connected clients
  client.on('disconnect', function() {
    socket.broadcast(
      JSON.stringify(
        world.disconnect(playerId)
      )
    );
  });
});

console.log('running');
