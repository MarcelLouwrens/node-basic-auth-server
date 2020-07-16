const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

// json web token ~ subject
function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, uat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	// User already authenticated
	// Issue token
	res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {

	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.send({ error: 'Username or password not provided'})
	}

	// Check if user exists
	User.findOne({ username: username }, function(err, existingUser){
		if (err) { return next(err); }

		// If user exists
		if (existingUser) {
			// Unprocessable entity
			return res.send({ error: 'Username is in use'});
		}
	})

	// Add user
	const user = new User({
		username: username,
		password: password
	})

	user.save(function(err) {
		if (err) { return next(err); }
		// Respond
		res.json({ token: tokenForUser(user) });
	});

	
}