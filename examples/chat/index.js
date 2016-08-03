// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('../..')(server);
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


// home automation

var numDevices = 0;
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;
  console.log("connection");

  // when the client emits 'add user', this listens and executes
  socket.on('add_device', function (device_id) {
    console.log("added device");

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

  // when the client emits 'typing', we broadcast it to others
  socket.on('on', function (device_id) {
    socket.broadcast.emit('on', {
      device_id: socket.device_id,
    });
  });

  socket.on('off', function (device_id) {
     socket.broadcast.emit('off', {
      device_id: socket.device_id,
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;
    }
  });
});


