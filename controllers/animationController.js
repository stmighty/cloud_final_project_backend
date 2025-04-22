const Animation = require("../models/Animation");
const { admin } = require("../config/firebaseAdmin"); // firebase-admin config

exports.getAllAnimations = async (req, res) => {
    try {
        const allAnimations = await Animation.find();
        return res.status(200).json({
            success: true,
            animations: allAnimations,
            count: allAnimations.length
        })
    }
    catch (error) {
        console.error("Error fetching all animations:", error);
        return res.status(500).json({ success: false, error: "Failed to fetch all animations" });
    }
}

exports.createAnimation = async (req, res) => {
    try {
        const { title, frames = [] } = req.body;
        const userId = req.user.uid; // Extract userId from the authenticated user

        // Validate input data
        if (!userId) {
            return res.status(400).json({ success: false, message: "Please provide userId." });
        }

        // Create a new animation document
        const newAnimation = new Animation({
            title,
            userId,
            frames,
            thumbnail: frames.length > 0 ? frames[0].data : ""
        });

        // Save the animation document to the database
        await newAnimation.save();

        return res.status(201).json({
            success: true,
            animation: newAnimation,
        });
    } catch (error) {
        console.error("Error creating animation:", error);
        return res.status(500).json({ success: false, error: "Failed to create animation" });
    }
}

exports.updateAnimation = async (req, res) => {
    try {
        const { id } = req.params;
        const uid = req.user.uid;
        const { title, frames, thumbnail } = req.body;

        const animation = await Animation.findById(id);
        if (!animation) {
            return res.status(404).json({ success: false, message: "Animation not found." });
        }
        if (animation.userId !== uid) {
            return res.status(403).json({ success: false, message: "Not authorized to update this animation." });
        }

        // Update fields if provided
        if (title !== undefined) {
            animation.title = title;
        }
        if (frames !== undefined) {
            animation.frames = frames;
        }
        if (thumbnail !== undefined) {
            animation.thumbnail = thumbnail;
        }

        await animation.save();

        return res.status(200).json({ success: true, animation });
    } catch (error) {
        console.error("Error updating animation:", error);
        return res.status(500).json({ success: false, error: "Failed to update animation." });
    }
}

exports.deleteAnimation = async (req, res) => {
    try {
        const { id } = req.params;
        const uid = req.user.uid;

        const animation = await Animation.findById(id);
        if (!animation) {
            return res.status(404).json({ success: false, message: "Animation not found." });
        }
        if (animation.userId !== uid) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this animation." });
        }

        await Animation.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Animation deleted successfully." });
    } catch (error) {
        console.error("Error deleting animation:", error);
        return res.status(500).json({ success: false, error: "Failed to delete animation." });
    }
}