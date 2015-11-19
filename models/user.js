// models.user.js

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
	username: { type: String, unique: true },
	password: String,
	posts: [{
	type: Schema.Types.ObjectId,
	ref: 'Post'
	}]
});


UserSchema.plugin(passportLocalMongoose, {
	populateFields: 'posts'
});

// create User model and export it
var User = mongoose.model('User', UserSchema);
module.exports = User;