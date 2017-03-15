var movementController = require('../controller/movementController');

var sessionStore     = require('connect-mongo'), // find a working session store (have a look at the readme)
    passportSocketIo = require("passport.socketio");

module.exports = function(io){








	var movementStepCount = 0;

	io.on('connection', function(socket){
	// establish connection, socket = data from socket aka Client side!
	// similar to doc ready function?
		socket.on('step', function(podo_step_oldData){
		// data is sent from the 'step' event on client side from main.js
			console.log('SOCKET - socket.request.user: ',socket.request.user);
			if (socket.request.user && socket.request.user.logged_in) {
				console.log('SERVER Socket received podo_step_old data:', podo_step_oldData);
				movementController.saveStep(podo_step_oldData)
		    }
		});
	});
};
/*
// on connection event
eventSocket.on('connection', function(socket) {

  // example 'event1', with an object. Could be triggered by socket.io from the front end
  socket.on('event1', function(eventData) {
  	// user data from the socket.io passport middleware
    if (socket.request.user && socket.request.user.logged_in) {
      console.log(socket.request.user);
    }
  });
});
*/




/* Reference from before:
module.exports = function(io){

	// add a connect listener
	// client == socket here
	// io == global
	io.on('connection', function(client){

		client.on('wdi:chat:msg', function(data) {
			// broadcast to all
			// io.emit('wdi:chat:newMsg', data);

			// broadcast to all except sender
			client.broadcast.emit('wdi:chat:newMsg', data);
		});

		client.on('wdi:chat:location', function(data) {

			io.emit('wdi:chat:location', data);
		});

		//Disconnect listener
		client.on('disconnect', function() {
			console.log('Client disconnected.');
		});

	});
};
*/