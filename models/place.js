const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//defining the schema for places
const PlaceSchema = new Schema ({
     title: { type: String, require: true },
     description: { type: String, require: true },
     // we store image path here only
     image: { type: String, require: true },
     address: { type: String, require: true },
     location: {
         lat: { type: Number, require: true },
         lng: { type: Number, require: true },
     },
     // making realtion with User Shema
     creator: { type: mongoose.Types.ObjectId, require:true, ref: 'User' }

});

module.exports = mongoose.model('Place', PlaceSchema);