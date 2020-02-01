// Express framework example
var express = require('express');

// Crypto module
let encrypt;

try {
  encrypt = require('crypto');
} catch (cryptoError) {
  console.log('WARNING: CRYPTO SUPPORT IS NOT AVAILABLE!');
  exit();
}

// Base64 URL codec library
const base64url = require('base64url');

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
  var newUser = {
    'username': request.body.username,
    'email': request.body.email
  };

  // Store the username, password and email in the db
  if(users.findIndex((user) => user.username === newUser.username) === -1) {
    hash = encrypt.createHash('sha256');
    hash.update(request.body.password);

    newUser.password = hash.digest('hex');

    // No username exists that matches the given username, so add a new user
    users.push(newUser);
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
  var auth = {
    'email': request.body.email,
    'password': request.body.password
  };

  hash = encrypt.createHash('sha256');
  hash.update(auth.password);

  const userIndex = users.findIndex((user) => user.email === auth.email);

  if(userIndex !== -1) {
    // User exists, check to see if the login password matches the user record
    const verifiedUser = users[userIndex];

    if(verifiedUser.password === hash.digest('hex')) {
      // Generate web token
      var securityToken;

      const tokenHeader = {
        "alg": "HS256",
        "typ": "JWT"
      };

      const hmac = encrypt.createHmac('sha256', 'secret');

      hmac.update(
        base64url.encode(JSON.stringify(tokenHeader)) + "." + base64url.encode(JSON.stringify(verifiedUser))
      );

      securityToken = hmac.digest('hex');

      response.send({
        'message': 'User was successfully signed in!',
        'user': verifiedUser,
        'securityToken': securityToken
      });
    } else {
      response.send('Password is incorrect. Please recheck your login credentials and try again.');
    }
  } else {
    response.send('ERROR: User not found.');
  }
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
