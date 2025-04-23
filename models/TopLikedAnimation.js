const mongoose = require('mongoose');

const topLikedAnimationSchema = new mongoose.Schema({
    animations: [{
        animationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Animation',
            required: true
        },
        likeCount: {
            type: Number,
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // Document will be automatically deleted after 24 hours
    }
});

module.exports = mongoose.model('TopLikedAnimation', topLikedAnimationSchema); 