var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('<3 O HAI NKO <3!\n');
}).listen(80);
console.log('server running');
