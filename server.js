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

// JWT token generator
jwt = require('jsonwebtoken');

// Base64 URL codec library
const base64url = require('base64url');

var app = express();
const session = require('express-session');

// Set up the JSON and session middlewares
app.use(express.json());
app.use(session({secret: 'secret'}));

var users = [];

app.get('/', function (request, response) {
  response.send('Hello World!');
});

app.get('/me', function (request, response) {
  console.log("Display user information");

  // Attach authorization header with bearer token
  response.append('Authorization', 'Bearer: ' + request.session.jwt);

  const verifyUserJWT = jwt.verify(request.session.jwt, "secret");

  if(verifyUserJWT) {

    response.send({
      'message': 'Successfully verified user token!',
      'req.user': jwt.decode(request.session.jwt)
    });
  } else {
      response.send("User authentication token could not be verified. Please sign in again.");
  }
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

  // Web security token that represents the currently logged in and authed user
  var securityToken;

  if(userIndex !== -1) {
    // User exists, check to see if the login password matches the user record
    const verifiedUser = users[userIndex];

    if(verifiedUser.password === hash.digest('hex')) {

      const tokenHeader = {
        "alg": "HS256",
        "typ": "JWT"
      };

      securityToken = jwt.sign(JSON.stringify(verifiedUser), "secret");

      request.session.jwt = securityToken;

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
