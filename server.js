//server.js
//SERVER SIDE JAVASCRIPT
var express = require('express');
	app = express();
	bodyParser = require('body-parser');
	mongoose = require('mongoose');

// configure body-parser (for form data)
app.use(bodyParser.urlencoded({ extended: true }));

//server static files from public folder
app.use(express.static(__dirname + '/public'));

// express will use hbs in views directory
app.set('view engine', 'hbs');

//connect to mongodb
mongoose.connect('mongodb://localhost/microblog-app');

// require Post model
var Post = require('./models/post');


// Homepage route
app.get('/', function (req, res) {
	res.render('index');
});

// API Routes


app.get('/api/posts', function (req, res) {
	// find all posts (with comments) in db
	Post
	.find()
	.populate('comments')
	.exec(function (err, allPosts) {
		res.json({ posts: allPosts });
	});
});

// get one blog post
app.get('/api/posts/:id', function (req, res) {
	// get post ID from url params and save to variable
	var postId = (req.params.id);
	
	//find one post (with comment) in db by ID
	Post
	.findOne({ _id: postId })
	.populate('comments')
	.exec(function (err, foundPost) {
		res.json(foundPost);
	});
});


// create new blog post
app.post('/api/posts', function (req, res) {
	var newPost = new Post(req.body);

	// save new blog post in db
	newPost.save(function (err, savedPost) {
		res.json(savedPost);
	});
});

// update blog post

app.put('/api/posts/:id', function(req, res) {
	// get blog post ID from url params and save to variable
	var postId = req.params.id;
	
	// find blog post in db by ID
	Post.findOne({ _id: postId }, function(err, foundPost) {
		// update the blog post's attributes
		
		foundPost.post = req.body.post;
		foundPost.description = req.body.description;
		foundPost.image = req.body.image;

		// save updated blog post in db
		foundPost.save(function (err, savedPost) {
			res.json(savedPost);
		});
	});
});


// delete blog post
app.delete('/api/posts/:id', function(req, res) {
	// get blog post ID from url params and save to variable
	var postId = (req.params.id);
	
	// find blog post in db by ID and remove
	Post.findOneAndRemove({ _id: postId }, function(err, deletedPost) {
		res.json(deletedPost);
	});
});

// add comments to blog post
app.post('/api/posts/:postId/comments', function(req, res) {
	// get blog post ID from url params and save to variable
	var postId = req.params.postId;
	
	// find blog post in db by ID
	Post.findOne({ _id: postId }, function(err, foundPost) {
		// create new comment
		var newComment = new Comment(req.body);

		// save new comment in db
		newComment.save(function (err, savedComment) {

			// add comment to post (update blog post)
			foundPost.comments.push(savedComment);

			//save post
			foundPost.save(function (err, savedPost) {
				res.json(savedPost);
			});
		});
	});	
});

// delete comments from blog post
app.delete('/api/posts/:postId/comments/:commentId', function(req, res) {
	// get blog post and comment ID from url params and save to variable
	var postId = req.params.postId;
	var commentId = req.params.commentId;

	// find blog post in db by ID
	Post.findOne({ _id: postId }, function(err, foundPost) {
		var commentIndex = foundPost.comments.indexOf(commentId);
		// remove comment from post
		foundPost.comments.splice(commentIndex, 1);

		//save post
		foundPost.save(function (err, savedPost) {
			res.json(savedPost);
		});
	});	
});

// starts server on localhost
app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening at http://localhost:3000/');

});