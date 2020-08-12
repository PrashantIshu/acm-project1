const mongoose = require('mongoose');
const User = require('./userModel');

const secretSchema = new mongoose.Schema({
    secrets: {
        type: String
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

const Secret = new mongoose.model('Secret', secretSchema);

module.exports = Secret;