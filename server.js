// Express framework example
var express = require('express');

// NoSQL db setup
var nosql = require('nosql');
var DB = nosql.load('/simpleauthapi.nosql');

var app = express();

app.get('/', function (request, response) {
  response.send('Hello World!');
});

app.get('/me', function (request, response) {

});

app.post('/sign-up', function (request, response) {

});

app.post('/sign-in', function (request, response) {

});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
