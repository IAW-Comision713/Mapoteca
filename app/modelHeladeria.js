// Pulls Mongoose dependency for creating schemas
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Creates a Heladeria Schema. This will be the basis of how heladeria data is stored in the db
var HeladeriaSchema = new Schema({
    nombre: {type: String, required: true},
    direccion: {type: String, requierd: true},
    location: {type: [Number], required: true},
    telefono: {type: String, required: false},
    artesanal: {type: Boolean, required: true},
    delivery: {type: Boolean, required: true},
    precio: {type: Number, required: true},
    gustos: {type: [String], required: false}, 
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
HeladeriaSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

HeladeriaSchema.index({location: '2dsphere'});
// Exports the UserSchema for use elsewhere. Sets the MongoDB collection to be used as: "scotch-users"
module.exports = mongoose.model('Heladeria', HeladeriaSchema);