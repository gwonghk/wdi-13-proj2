var mongoose = require('mongoose');

var movementSchema = new mongoose.Schema({

	totalSteps: Number,
	sessionSteps: Number,
	updated: { type: Date, default: Date.now() }

});

var Movement = mongoose.model('Movement', movementSchema);
module.exports = Movement;

