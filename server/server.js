var http = require('http');
var io = require('socket.io.js');

//
// http
//

server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>Hello world</h1>');
  res.close();
});

server.listen(8080);

//
// websocket
//

var socket = io.listen(server);

socket.on('connection', function(client) {
  client.on('message', function() {
    console.log(".");
  });

  client.on('disconnect', function() {
    console.log("disconnect");
  });
});

console.log('running');
