// Dependencies
var mongoose        = require('mongoose');
var Heladeria            = require('./modelHeladeria.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all heladerias in the db
    app.get('/heladerias', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Heladeria.find({});
        query.exec(function(err, users){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(users);
        });
    });

    app.get('/edit', function(req,res){
        res.redirect('addHeladeria.html');
    });

    app.get('/', function(req,res){
        res.redirect('index.html');
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/heladerias', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newheladeria = new Heladeria(req.body);

        // New User is saved in the db.
        newheladeria.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });
};  