const mongoose = require('mongoose');

const animationReactionSchema = new mongoose.Schema({
    animationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animation',
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    isLiked: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

// Create a compound index to ensure one user can only have one reaction per animation
animationReactionSchema.index({ animationId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('AnimationReaction', animationReactionSchema); 