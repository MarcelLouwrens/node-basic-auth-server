const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Model
const userSchema = new Schema({
	username: { type: String, unique: true, lowercase: true },
	password: String
});


// On Save Hook, encrypt password

userSchema.pre('save', function(next){

	// get access to user model
	const user = this;

	// generate a salt, then callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) { return next(err); }

		// hash password using salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) {return next(err); }

			// overwrite password
			user.password = hash;
			next();
		})
	})
})


userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if (err) { return callback(err); }

		callback(null, isMatch);
	})
}

// Create Model Class
const ModelClass = mongoose.model('user', userSchema);



// Export Model
module.exports = ModelClass;

//"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="C:\dev\rc66 web app _ V1\auth-server\data\db"