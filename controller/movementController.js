var Movement = require('../models/movement');

exports.saveStep = function(step){

	var movement = new Movement({
				totalSteps : step
			});
    movement.save(function(err, data){
	// data = an obj of movement schema with the new data saved
        if(err){
        	console.log('SERVER ERROR: ', err);
        }
    });
}

