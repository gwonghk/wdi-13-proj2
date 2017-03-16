var Movement = require('../models/movement');
var ObjectId = require('mongodb').ObjectId;

exports.updateStep = function(user, podo_step){

	var userMovement = user.pet[0].movement[0]._id;

	Movement.findOne( {'_id': userMovement }, function (err, movement){
		if(err){
			console.log('movementControl.updateStep: error in datbase call:');
			return err;
		}
		if (movement){
			movement.totalSteps = podo_step;
			movement.save((err) => {
				if(err){
					console.log('movementControl.updateStep error:', err); }});
			console.log('movement.Controller - step saved:', movement.totalSteps);
		}
	});
}