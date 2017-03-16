var movementController = require('../controller/movementController');

var sessionStore     = require('connect-mongo'); // find a working session store (have a look at the readme)
var passportSocketIo = require("passport.socketio");

module.exports = function(io){

	var movementStepCount = 0;

	io.on('connection', function(socket){
	// establish connection, socket = data from socket aka Client side!
	// similar to doc ready function?
		socket.on('step', function(podo_step){
		// data is sent from the 'step' event on client side from main.js
			if (socket.request.user && socket.request.user.logged_in) {
			// check that user is loggedin
				movementController.updateStep(socket.request.user, podo_step);
		    }
		});
	});
};

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