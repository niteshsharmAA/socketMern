const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: Array,
        required: true,
        default: []
    },
    image: {
        type: String,
        required: false,
        default: ''
    },
    type: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('room', roomSchema);