const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

//shema for users
const userShema = new Schema({
    name: { type: String, require:true },
    email: { type: String, require:true, unique:true },
    password: { type: String, require: true, minlength: 6},
    image: { type: String, require: true },
    places : { type: String, require:true }
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userShema);