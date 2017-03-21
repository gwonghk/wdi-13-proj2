var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Pet = require('./pet');
var Bag = require('./bag');

var userSchema = mongoose.Schema({
	firstname	: {type: String},
	lastname	: {type: String},
	email 		: {type: String,
					unique: true,
					required: true},
	password 	: {type: String},
	pet			: [{ type: mongoose.Schema.Types.ObjectId,
					ref: 'Pet' }],
	bag 		: [{ type: mongoose.Schema.Types.ObjectId,
					ref: 'Bag' }],
	facebook: {
		accessToken: String,
		refreshToken: String,
		id: String,
		profile: mongoose.Schema.Types.Mixed
	}
},{
	timestamps: true
});


userSchema.pre('save', function(next){
	const user = this;

	if(!user.isModified('password')) { return next(); }

	bcrypt.genSalt(10, (err, salt) => {
		if(err){ return next(err);
		}

		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if(err){ return next(err); }
			user.password = hash;
			next();
		});
	});
});


userSchema.methods.validPassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        cb(err, isMatch);
    });
};

var User = mongoose.model('User', userSchema);
module.exports = User;

