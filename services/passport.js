const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Local Strategy

const localLogin = new LocalStrategy({usernameField: 'username'} ,function(username, password, done){
	// verify username and password, call done if exists. Otherwise call done with false
	User.findOne({ username: username}, function(err, user){
		if (err) { return done(err); }
		if (!user) { return done(null, false); }

		user.comparePassword(password, function(err, isMatch){
			if (err) { return done(err); }
			if (!isMatch) { return done(null, false); }

			return done(null, user);
		})
	})
})

// Strategy Options
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

// Create Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
	// Check if id in payload exists. Then call done with user, otherwise just call done
	User.findById(payload.sub, function(err, user){

		if (err) { return done(err, false); }

		if (user) {
			done(null, user);
		}
		else {
			done(null, false);
		}
	})
})


// Use Strategy in Passport

passport.use(jwtLogin);
passport.use(localLogin);