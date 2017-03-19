var movementController = require('../controller/movementController');

var sessionStore     = require('connect-mongo'); // find a working session store (have a look at the readme)
var passportSocketIo = require("passport.socketio");

module.exports = function(io){
	io.on('connection', function(socket){
	// establish connection, socket = data from Client side
		socket.on('step', function(stepDistance, cb){
		// data is sent from the 'step' event on client side from main.js
		// why is this being called twice?!
			if (socket.request.user && socket.request.user.logged_in) {
			// check that user is loggedin
				movementController.updateStep(socket.request.user, stepDistance, function(totalSteps, treasureSessionSteps) {
	    			io.emit('updated-stepCount', totalSteps, treasureSessionSteps, socket.request.user);
				});
		    }
		});

		socket.on('treasureGame-start', function(treasureStepCountInput) {
			movementController.setTreasureStepCount(socket.request.user, treasureStepCountInput);
		})

		/*socket.on('treasureGame-step', function(stepDistance){
			movementController.updateTreasureStepCount(socket.request.user, stepDistance, function(remainingTreasureSteps) {
				if (remainingTreasureSteps > 0) {
					io.emit('update-treasureStepCount', remainingTreasureSteps);
				} else if (remainingTreasureSteps <= 0) {
					io.emit('end-treasure-game');
				};

			})
			console.log(' movementController-reduce treasureGame step by stepDistance:', stepDistance);
		});


		socket.on('treasureGame-stepUpdate-req', function(){
			io.emit('treasureGame-stepUpdate-res')
			console.log('movementController-get the info from db and update UI');
			// body...
		})*/

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