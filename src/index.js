/*
    Cyan, Home automation api and platform
    Copyright (C) <2016>  <Konstantino Sparakis>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//OPTIONS
var DEBUG = 1; // 1 = console log messages appear, 0 = no console messages
var https = 1; // 1 = https, 0 = http; for security you want https running

// Setup of Express Server
var fs = require('fs');
var express = require('express');
var app = express();
var server;
if(https === 1)
{
  var credentials = {
    // To generate and sign your own keys follow these steps in a terminal:
    //  openssl genrsa -des3 -out server.enc.key 1024
    //  openssl req -new -key server.enc.key -out server.csr
    //  openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
    key  : fs.readFileSync('ssl/server.key'),
    cert : fs.readFileSync('ssl/server.crt')
  };
  server = require('https').createServer(credentials, app);
}
else
{
  server = require('http').createServer( app);
}
var io = require('./')(server);
var port = process.env.PORT || 3000;



var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

//Global connection variabls
var numDevices = 0;
var numUsers = 0;


/*
*
*  SOCKET IO connection handeling
*
*/
io.on('connection', function (socket) {
  var addedUser = false;
  console.log("connection");

  // when the client emits 'add user', this listens and executes
  socket.on('device/connect', function (device_id) {
    console.log("device connected");

    // we store the  device_id in the socket session for this client
    socket.device_id = device_id;
    ++numDevices;
    socket.emit('registered', {
      numDevices: numDevices
  });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('device added', {
      username: socket.device_id,
    });

  });


// when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;
    }
  });



/*
*
*     Socket controlls for user clients
*
*/

 
//check the username to see if its valid
  socket.on('login/check_username', function (username) {
    if (addedUser) {
      --numUsers;
    }
  });

// logs user in and returns an access token
  socket.on('login', function (username, password) {

  });

// disables user token
  socket.on('logout', function (user_token) {

  });


//returns a list of deivces
  socket.on('devices/get', function (user_token) {

  });


// creates a new device
  socket.on('device/new', function (device_name, device_type) {

  });

  //returns a list of devices
  socket.on('device/edit', function (user_token, device_id) {

  });

 //deletes the specified device
  socket.on('device/delete', function (user_token, device_id) {

  });

//returns a json of all device data relevant to that device
  socket.on('device/get/data', function (user_token) {

  });

   //turns a specified device on
  socket.on('device/on', function (device_id) {
    console.log("Recieved On command");
    socket.broadcast.emit('on', {
      device_id: socket.device_id,
    });
  });

  //turns a specified device off
  socket.on('device/off', function (device_id) {
     socket.broadcast.emit('off', {
      device_id: socket.device_id,
    });
  });


/*
*
*     Socket controlls for devices
*
*/

// logs user in and returns an access token
  socket.on('device/post/data', function (device_id, data) {

  });



});


