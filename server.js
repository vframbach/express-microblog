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
	res.send('hello world');
});




// starts server on localhost
app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening at http://localhost:3000/');

});