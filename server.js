//server.js
//SERVER SIDE JAVASCRIPT
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	hbs = require('hbs'),
	mongoose = require('mongoose'),

	// auth
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,

	GitHubStrategy = require('passport-github').Strategy,
	oauth = require('./oauth.js');



// configure body-parser (for form data)
app.use(bodyParser.urlencoded({ extended: true }));

//server static files from public folder
app.use(express.static(__dirname + '/public'));

// express will use hbs in views directory
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

//connect to mongodb
mongoose.connect('mongodb://localhost/microblog-app');

// require Post model
var Post = require('./models/post');

// require User model
var Post = require('./models/post'),
	User = require('./models/user');


// tells express to use auth middleware
app.use(cookieParser());
app.use(session({
	secret: 'supersecretkey',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


// passport config, allow users to sign up, log in and out
passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// serialize and deserialize
passport.serializeUser(function (user, done) {
	done(null, user);
});
passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(new GitHubStrategy({
	clientID: oauth.github.clientSecret,
	clientSecret: oauth.github.clientSecret,
	callbackURL: oauth.github.callbackURL
}, function (accessToken, refreshToken, profile, done) {
	process.nextTick(function() {
		return done(null, profile);
	});
}));


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
app.post('/api/posts', function(req, res) {
    if (req.user) {
        var newPost = new Post(req.body);

        // save new blog post in db
        newPost.save(function(err, savedPost) {
            if (err) {
                res.status(500).json({
                    error: err.message
                });
            } else {
                req.user.posts.push(savedPost);
                req.user.save();
                res.json(savedPost);
            }
        });
    } else {
        res.status(401).json({
            error: 'Unauthorized'
        });
    }
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

// AUTH ROUTES

// show signup view 
app.get('/signup', function(req, res) {
	res.render('signup');
});

// show login view
app.get('/login', function (req, res) {
	res.render('login');
});


// sign up new user, then log them in
// hashes and salts password, saves new user to db
app.post('/signup', function (req, res) {

	// if user is logged in, don't let them sign up again
	if (req.user) {
		res.redirect('/profile');
	} else {

	}
	User.register(new User({ username: req.body.username }), req.body.password, 
		function  (err, newUser) {
			passport.authenticate('local')(req, res, function() {
				// res.send('signed up!!!');
				res.redirect('/');
			});
		}
	);
});

app.get('/auth/github', passport.authenticate('github'), function (req, res) {
  // the request will be redirected to github for authentication,
  // so this function will not be called
});

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    console.log(req.user);
    res.redirect('/profile');
  }
);


// Homepage route
app.get('/', function (req, res) {
	res.render('index', { user: req.user });
});

// log in user, runs when user submits form
app.post('/login', passport.authenticate('local'), function (req, res) {
	// res.send('logged in!!!');
	res.redirect('/');
});

// log out user
app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// show user profile page
app.get('/profile', function (req, res) {
	res.render('profile', { user: req.user });
});


// starts server on localhost
app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening at http://localhost:3000/');

});