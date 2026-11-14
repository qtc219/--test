// models/userModel.js
const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  username: {
        type: String,
        required: true,
        unique: true
    },
  password: String
});

module.exports = mongoose.model('User', UserSchema);