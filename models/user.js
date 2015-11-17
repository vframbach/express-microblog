// models.user.js

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
	username: String,
	password: String
});

// passportLocalMongoose hashes and salts plain text password, compares to db
UserSchema.plugin(passportLocalMongoose);

// create User model and export it
var User = mongoose.model('User', UserSchema);
module.exports = User;