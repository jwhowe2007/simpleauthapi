// Express framework example
var express = require('express');

// Crypto module
let encrypt;

try {
  encrypt = require('crypto');
  hash = encrypt.createHash('sha256');
} catch (cryptoError) {
  console.log('WARNING: CRYPTO SUPPORT IS NOT AVAILABLE!');
  exit();
}

// NoSQL db setup
var nosql = require('nosql');
var DB = nosql.load('/simpleauthapi.nosql');

var app = express();

app.use(express.json());

var users = [];

app.get('/', function (request, response) {
  response.send('Hello World!');
});

app.get('/me', function (request, response) {
  console.log("Display user information");

  response.send("Name: Joe Schmoe");
});

app.post('/sign-up', function (request, response) {
  console.log("Sign up a user");

  // Store the username, password and email in the db
  if(users.findIndex((user) => user.username === newUser.username) === -1) {
    hash.update(request.body.password);

    var newUser = {
      'username': request.body.username,
      'email': request.body.email,
      'password' : hash.digest('hex')
    };

    // No username exists that matches the given username, so add a new user
    users = users.push(newUser);
  } else {
    response.send('User already exists - no operation was performed');
  }

  response.send({
      'message': 'User signed up!',
      'username': newUser.username,
      'password': newUser.password,
      'email': newUser.email
  });
});

app.post('/sign-in', function (request, response) {
  console.log("User signed in");

  response.send('User was successfully signed in!');
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
