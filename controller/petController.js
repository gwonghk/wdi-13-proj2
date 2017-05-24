var Movement = require('../models/movement');
var Pet = require ('../models/pet');
var User = require ('../models/user');
var ObjectId = require('mongodb').ObjectId;

exports.getPet = function(userObj, cb) {
	var petID = userObj.pet[0];

	Pet.findById( petID , function(err, pet) {
		if(err){
			console.log('petController.getPet: error in datbase call:');
			return err;
		}
		cb ( pet.name, pet.type, pet.age )
	});
}