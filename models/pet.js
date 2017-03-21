var mongoose = require('mongoose');
var Movement = require('./movement');

var petSchema = new mongoose.Schema({

	name: {type: String},
	type: {type: String, default: 'poring' },
	age: {type: Number},
	movement: [{ type: mongoose.Schema.Types.ObjectId,
					ref: 'Movement' }],

});

var Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;

