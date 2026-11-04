const mongoose = require('mongoose');

const vaultModelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    cloudinaryId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'analyzed', 'error'],
        default: 'pending'
    },
    volume: {
        type: Number
    },
    dimensions: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('VaultModel', vaultModelSchema);