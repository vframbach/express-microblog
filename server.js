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


// test data
// var allPosts  = [
//     	{ post: 'Post #1', description: 'description' },
//     	{ post: 'Post #2', description: 'description' }
//     ];

app.get('/api/posts', function (req, res) {
	Post.find(function (err, allPosts) {
		res.json({ posts: allPosts });
	});
});


// starts server on localhost
app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening at http://localhost:3000/');

});