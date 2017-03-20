var Movement = require('../models/movement');
var ObjectId = require('mongodb').ObjectId;

exports.updateStep = function(user, stepDistance, cb){
	// update user's pet's movement count in the database
	var userMovement = user.pet[0].movement[0]._id;

	Movement.findOne( {'_id': userMovement }, function (err, movement){
		if(err){
			console.log('movementControl.updateStep: error in datbase call:');
			return err;
		}
		if (movement){
			movement.totalSteps += stepDistance;
			if (movement.treasureSessionSteps > 0 ){
				movement.treasureSessionSteps -= stepDistance;
			}
			movement.save((err) => {
				if(err){
					console.log('movementControl.updateStep error:', err); }
				});
			//console.log('movement.Controller-totalSteps', movement.totalSteps);
			//console.log('movement.Controller-treasureSessionSteps', movement.treasureSessionSteps);
		}
		cb( movement.totalSteps, movement.treasureSessionSteps);
	});
}

exports.setTreasureStepCount = function(user, input){
	// save the treasure distance into database
	var userMovement = user.pet[0].movement[0]._id;

	Movement.findOne( {'_id': userMovement }, function (err, movement){
		if(err){
			console.log('movementControl.setTreasureStepCount: error in datbase call:');
			return err;
		}
		if (movement){
			movement.treasureSessionSteps = input;
			movement.save((err) => {
				if(err){
					console.log('movementControl.setTreasureStepCount error:', err); }
			});
		}
	});
};

/*
exports.


	totalSteps: {type: Number},
	treasureSessionSteps: {type: Number, default: 0},
	updated: { type: Date, default: Date.now() }*/


/*
	Movement.findOneAndUpdate( query, update, options, function (err, movement){
		if(err){
			console.log('movementControl.updateStep: error in datbase call:', err);
		}
		if (movement){
			//console.log('movement.Controller-podo_stepDistance:', podo_stepDistance);
			// movement.totalSteps += podo_stepDistance;
			movement.save((err) => {
				if(err){
					console.log('movementControl.updateStep error:', err); }
				});
			// return movement;
			//return movement.totalSteps;
			console.log('movement.Controller - step saved:', movement.totalSteps);
			return (movement.totalSteps);
		}
	});
*/