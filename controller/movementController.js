var Movement = require('../models/movement');
var ObjectId = require('mongodb').ObjectId;

exports.updateStep = function(user, podo_step){

	var userMovement = user.pet[0].movement[0]._id;

	console.log('this is userMovement', userMovement);
	console.log('this is userMovement type', typeof userMovement);

	var o_id = new ObjectId(userMovement);


	Movement.findOne( {'_id': '58c8f0edcdfaaa03b4171ea4' }, function (err, movement){
		console.log(err);
		if(err){
			//console.log('movementControl.updateStep: error in datbase call');
			return err;
		}
		if (movement){
			movement.totalSteps = podo_step;
			movement.save((err) => {
				console.log('update movement, returned error:', err); });
			console.log('movement updated!');
		}
	});

	//movement.totalSteps = podo_step;
    /*
    movement.save(function(err, data){
	// data = an obj of movement schema with the new data saved
        if(err){
        	console.log('SERVER ERROR: ', err);
        }
    });
	console.log('Updated Step: ', movement.totalSteps);
    */
}

