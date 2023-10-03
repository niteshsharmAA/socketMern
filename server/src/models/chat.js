const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Types.ObjectId,
        ref: 'room',
        required: true
    },
    message: [
        {
            sender: {
                type: mongoose.Types.ObjectId,
                ref: 'user',
                required: true
            },
            message: String,
            timestamp: {
                type: Date,
                default: new Date()
            },
            _id: false
        }
    ],
    totalMessages: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('chat', chatSchema);