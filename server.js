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
	// find all posts in db
	Post.find(function (err, allPosts) {
		res.json({ posts: allPosts });
	});
});

// get one blog post
app.get('/api/posts/:id', function (req, res) {
	// get post ID from url params and save to variable
	var postId = parseInt(req.params.id);
	//find post we want to read
	
	//find post in db by ID
	Post.findOne({ _id: postId }, function (err, foundPost) {
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
	console.log(postId);
	// find blog post in db by ID
	Post.findOne({ _id: postId }, function(err, foundPost) {
		// update the blog post's attributes
		console.log(foundPost, err);
		foundPost.post = req.body.post;
		foundPost.description = req.body.description;

		// save updated blog post in db
		foundPost.save(function (err, savedPost) {
			res.json(savedPost);
		});
	});
});


// delete blog post
app.delete('/api/posts/:id', function(req, res) {
	// get blog post ID from url params and save to variable
	var postId = parseInt(req.params.id);
	
	// find blog post in db by ID and remove
	Post.findOneAndRemove({ _id: postId }, function(err, deletedPost) {
		res.json(deletedPost);
	});
});

// starts server on localhost
app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening at http://localhost:3000/');

});