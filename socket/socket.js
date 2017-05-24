var async = require("async");

var movementController = require('../controller/movementController');
var petController = require('../controller/petController');

var sessionStore     = require('connect-mongo'); // find a working session store (have a look at the readme)
var room = 'roomFido';
var connectedUsers = []; // contains connected user objects
var activeUsers = []; // contains repacked user objects with db query

//__________________________________
//  Allow arr.unique() to be used 	\________________(need to move this)
Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

module.exports = function(io){
	io.on('connection', function(socket){

		function addConnectedUsers() {
			connectedUsers.unique();
			if (!connectedUsers.includes(socket.request.user)) {
				// if user isnt in the array, add them to it
				connectedUsers.push(socket.request.user);
				connectedUsers.forEach(function(e) {
					console.log(e.firstname, 'is connected');
				})
				console.log('SOCKET.js total connectedUsers:', connectedUsers.length);
			};
		}

		function prepareLeaderBoardInfoAsync() {
			activeUsers = []
			// 1st para in async.each() is the array of items
			async.each(connectedUsers,
				// 2nd param is the function that each item is passed to
				function(e, callback){
					// Call an asynchronous function, often a save() to DB
					if(e._id == socket.request.user._id) {
							e = socket.request.user;
						};
					movementController.getMovement( e, function(movementTotalSteps, movementTreasureSteps){
						petController.getPet( e, function(petName, petType, petAge){

							var player = {
								userName: e.firstname,
								petName: petName,
								petType: petType,
								petAge: petAge,
								mvTotalStep: movementTotalSteps,
								mvTreasure: movementTreasureSteps
								//treasureCount = bag.treasureCount;
							};
							activeUsers.push(player);
							// Async call is done, alert via callback
							callback(activeUsers);
						})
					});
				},
				// 3rd param is the function to call when everything's done
				function(err){
					if (err) {
						// *** console.log('asyncErr:', err);
					}
					// All tasks are done now
					socket.emit('updateActiveUsers', activeUsers);
				}
			);
		}

		setInterval(function(){
		// regularly update ActiveUsers array info
			prepareLeaderBoardInfoAsync();
		}, 5000);

	//__________________________________
	//  Invoke Controller Functions 	\________________
		function saveStep(user, stepDistance) {
			movementController.updateStep(user, stepDistance, function(totalSteps, treasureSessionSteps) {
				socket.emit('fromController-updatedStepCount', totalSteps, treasureSessionSteps, socket.request.user);
			});
		};
	// establish connection, socket = data from Client side

	//__________________________
	//  Traffic Routing Events 	\________________



		// Join Pet Room
		socket.on('joinGlobalRoom', function(room, cb) {
			socket.join(room);
			//console.log(socket.request.user.firstname, 'joined GlobalRoomroom:', room);
			addConnectedUsers();
		});

		// Add Steps to Pets
		socket.on('step-action', function(stepDistance){
			// sending to all clients in 'game' room(channel), include sender
			var user = socket.request.user;
			if (user && user.logged_in) {
				saveStep(user, stepDistance)
				io.in(room).emit('step', stepDistance);
			}
		});


		socket.on('treasureGame-start', function(treasureStepCountInput) {
			movementController.setTreasureStepCount(socket.request.user, treasureStepCountInput);
		})

		socket.on('step', function(stepDistance) {
		// add step to self
			var user = socket.request.user;
			if (user && user.logged_in) {
			// check that user is loggedin
				movementController.updateStep(user, stepDistance, function(totalSteps, treasureSessionSteps) {
					socket.emit('fromController-updatedStepCount', totalSteps, treasureSessionSteps, socket.request.user);
					// this calls updateStepCount() on client
				});
			}
		});

		socket.on('disconnect', function() {
			for (var i = 0; i < connectedUsers.length; i++) {
				if (connectedUsers[i] == socket.request.user) {
					console.log(socket.request.user.firstname, 'disconnected');
					connectedUsers.splice(i, 1);
					console.log('remaining users:', connectedUsers);
				};
			}
		});
	});
}


/*
// sending to sender-client only
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.in('game').emit('message', 'cool game');

// sending to sender client, only if they are in 'game' room(channel)
socket.to('game').emit('message', 'enjoy the game');

// sending to all clients in namespace 'myNamespace', include sender
io.of('myNamespace').emit('message', 'gg');

// sending to individual socketid
socket.broadcast.to(socketid).emit('message', 'for your eyes only');

*/


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