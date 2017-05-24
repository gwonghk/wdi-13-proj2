var mongoose = require('mongoose');

var bagSchema = new mongoose.Schema({

	treasureCount: {type: Number, default: 0},
	zenny: {type: Number, default: 0},
	updated: { type: Date, default: Date.now() }

});

var Bag = mongoose.model('Bag', bagSchema);
module.exports = Bag;

