//server.js
//SERVER SIDE JAVASCRIPT
var express = require('express');
var app = express();
var bodyParser = require('body-parser');



// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

//server static files from public folder
app.use(express.static(__dirname + '/public'));

var server = app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening at http://localhost:3000/');

});