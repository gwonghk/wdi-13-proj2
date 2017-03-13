var mongoose = require('mongoose');

var petSchema = new mongoose.Schema({

	name: String,
	age: Number,
	inheritMovement: Number

});

var Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;

