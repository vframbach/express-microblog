var mongoose = require('mongoose');
	Schema = mongoose.Schema;

var PostSchema = new Schema( {
	post: String,
	description: String,
	image: String
});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;

