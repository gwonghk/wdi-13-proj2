var mongoose = require('mongoose');
var Movement = require('./movement');

var petSchema = new mongoose.Schema({

	name: String,
	age: Number,
	movement: [Movement.schema]

});

var Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;

