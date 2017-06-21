'use strict';
/**
 * Module dependencies.
 var app = require('./config/lib/app');
 var server = app.start();*/
// Dependencies
// -----------------------------------------------------
var express = require('express');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

const path = require('path');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcrypt');
const saltRounds = 10;

//var config = require('./config'); // get our config file
var User   = require('./app/modelUser'); // get our mongoose model

//mongoose.connect(config.database); // connect to database
app.set('superSecret', 'elsecreto'); // secret variable




// Express Configuration
// -----------------------------------------------------
// Sets the connection to MongoDB
mongoose.connect('mongodb://localhost/MeanMapApp');
// Logging and Parsing
app.use(express.static(__dirname + '/public'));// sets the static files location to public
app.use('/bower_components', express.static(__dirname + '/bower_components'));// Use BowerComponents
app.use(morgan('dev'));// log with Morgan
app.use(bodyParser.json());// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));// parse application/x-www-form-urlencoded
app.use(bodyParser.text());// allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));// parse application/vnd.api+json as json
app.use(methodOverride());


// Routes
// ------------------------------------------------------
app.get('/setup', function(req, res) {

	// create a sample user
	var password = 'admin'
	bcrypt.hash(password, saltRounds, function(err, hash) {
  		// Store hash in your password DB.
		var admin = new User({ 
			name: 'admin', 
			password: hash,
			admin: true 
		});
		admin.save(function(err) {
			if (err) throw err;

			console.log('User saved successfully');
			res.json({ success: true });
		});
	});
});

// basic route (http://localhost:8080)
// app.get('/', function(req, res) {
// 	res.send('Hello! The API is at http://localhost:' + port + '/api');
// });

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {

	console.log(req.body);
	// find the user
	User.findOne({
		name: req.usuario
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			bcrypt.compare(req.password, user.password, function(err, match) {
				if (!match) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				} else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign(
						{
							'username': user.name,
							'admin': user.admin
						}, 
						app.get('superSecret'), {
						expiresIn: 86400 // expires in 24 hours
					});

					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}		
			});

		}

	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/users', function(req, res) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);



require('./app/routes.js')(app);
// Listen
// -------------------------------------------------------
app.listen(port);
