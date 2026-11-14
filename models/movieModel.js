//models/movieModel.js
const mongoose = require('mongoose');

let MovieSchma = new mongoose.Schema({
    title:String,
    director: String
});

module.exports =  mongoose.model('Movie', MovieSchma);