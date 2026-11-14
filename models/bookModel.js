// models/bookModel.js
const mongoose = require('mongoose');
let BookSchema = new mongoose.Schema({
  name: String,
  author: String,
  price: Number
});
module.exports = mongoose.model('Book', BookSchema);