var mongoose = require('mongoose');

var movementSchema = new mongoose.Schema({

	totalSteps: {type: Number, min:0, default: 0},
	treasureSessionSteps: {type: Number, min: 0, default: 0},
	updated: { type: Date, default: Date.now() }

});

var Movement = mongoose.model('Movement', movementSchema);
module.exports = Movement;

