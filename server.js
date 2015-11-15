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
	Post.find(function (err, allPosts) {
		res.json({ posts: allPosts });
	});
});

// get one post
app.get('/api/posts/:id', function (req, res) {
	// get post ID from url params and save to variable
	var postId = parseInt(req.params.id);
	//find post we want to read
	var foundPost = posts.filter(function(post) {
		return post._id == postId;
	})[0];

	// send foundPost as JSON response
	res.json(foundPost);
});


// create new post
app.post('/api/posts', function (req, res) {
	var newPost = req.body;

	if (posts.length > 0) {
		newPost._id = posts[posts.length - 1]._id + 1;
	} else {
		newPost._id = 1;
	}

	posts.push(newPost);

	res.json(newPost);
});

// update post

app.put('/api/posts/:id', function(req, res) {
	// get post ID from url params and save to variable
	var postId = parseInt(req.params.id);
	// use ID to find post to update
	var postToUpdate = posts.filter(function (post) {
		return post._id == postId;
	})[0];

	postToUpdate.post = req.body.post;
	postToUpdate.description = req.body.description;
	// respond with updated post
	res.json(postToUpdate);
});

// delete post
app.delete('/api/posts/:id', function(req, res) {
	// get post ID from url params and save to variable
	var postId = parseInd(req.params.id);
	//use ID to find post to delete
	var postToDelete = posts.filter(function(post) {
		return post._id ==postId;
	})[0];
	//remove post from database
	posts.splice(posts.indexOf(postToDelete), 1);

	//respond with deleted post
	res.json(postToDelete);
});

// starts server on localhost
app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening at http://localhost:3000/');

});