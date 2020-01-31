// Hello World in Node!

// HTTP module
var http = require("http");

// Create a basic HTTP server listening on port 8081
http.createServer(function (request, response) {

  // Set content type to plaintext for 200 code responses
  response.writeHead(200, {'Content-Type': 'text/plain'});

  // Tack on a response string
  response.end("Hello World!\n");
}).listen(8081);

// Status log
console.log('Server running at http://127.0.0.1:8081/');
