var mongoose = require('mongoose');
var Movement = require('./movement');

var petSchema = new mongoose.Schema({

	name: {type: String},
	age: {type: Number},
	movement: [Movement.schema]

});

var Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;

