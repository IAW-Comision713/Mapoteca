// Dependencies
var mongoose        = require('mongoose');
var Heladeria            = require('./modelHeladeria.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------


    // Endpoint para obtener todas las heladerias
    app.get('/heladerias', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Heladeria.find({});
        query.exec(function(err, heladerias){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all objects
            res.json(heladerias);
        });
    });

    // Endpoint para obtener una heladería específica
    app.get('/heladerias/:id', function(req, res){

            Heladeria.findOne({_id: mongoose.Types.ObjectId(req.params.id)}, function(err, heladeria) {
                if(err)
                    res.send(err);

               res.json(heladeria); 
            });

    });


    app.get('/', function(req,res){
        res.redirect('index.html');
    });

    app.get('/login', function(req,res){
        res.redirect('login.html');
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/heladerias', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newheladeria = new Heladeria(req.body.heladeria);

        // New User is saved in the db.
        newheladeria.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });

    app.put('/heladerias/:id', function(req, res){

        console.log(req.body);
        console.log(req.params.id);

            Heladeria.findById(req.params.id, function (err, data) {
                
                    data.nombre = req.body.heladeria.nombre;
                    data.direccion = req.body.heladeria.vicinity;
                    data.location = req.body.heladeria.location;
                    data.telefono = req.body.heladeria.telefono;
                    data.artesanal = req.body.heladeria.artesanal;
                    data.delivery = req.body.heladeria.delivery;
                    data.precio = req.body.heladeria.precio;
                    data.gustos = req.body.heladeria.gustos;

                    console.log("edite el objeto");

                    data.save(function(err) {

                        console.log(err);
                        if (err) throw err;
                        res.json({ success: true });
                    });
            });
    });


    app.delete('/heladerias/:id', function(req, res){

        Heladeria.findByIdAndRemove(req.params.id, function(err, data) {
                if (err) throw err;
                res.json({ success: true });
            });
    });

    
};  