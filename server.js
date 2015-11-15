//server.js
//SERVER SIDE JAVASCRIPT
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// configure body-parser (for form data)
app.use(bodyParser.urlencoded({ extended: true }));

//server static files from public folder
app.use(express.static(__dirname + '/public'));

// express will use hbs in views directory
app.set('view engine', 'hbs');


// Homepage route
app.get('/', function (req, res) {
	res.render('index');
});

// API Routes


// test data
var allPosts  = [
    	{ post: 'Post #1', description: 'description' },
    	{ post: 'Post #2', description: 'description' }
    ];

app.get('/api/posts', function(req, res) {
	res.json({ posts: allPosts });
});


// starts server on localhost
app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening at http://localhost:3000/');

});