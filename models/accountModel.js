// models/accountModel.js
const mongoose = require('mongoose');
let accountSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    occurrence: {
        type: Date
    },
    type: {
        type:Boolean,
        default: false
    },
    account: {
        type: Number,
        require: true
    },
    remark: {
        type: String
    }
});
module.exports = mongoose.model('account', accountSchema);