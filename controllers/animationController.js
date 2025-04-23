const Animation = require("../models/Animation");
const AnimationReaction = require("../models/AnimationReaction");
const TopLikedAnimation = require("../models/TopLikedAnimation");
const { admin } = require("../config/firebaseAdmin"); // firebase-admin config

exports.getAllAnimations = async (req, res) => {
  try {
    const allAnimations = await Animation.find();
    const userId = req.user?.uid; // Get userId if user is logged in

    // If user is logged in, get their reactions for all animations
    let userReactions = {};
    if (userId) {
      const reactions = await AnimationReaction.find({ userId });
      userReactions = reactions.reduce((acc, reaction) => {
        acc[reaction.animationId.toString()] = reaction.isLiked;
        return acc;
      }, {});
    }

    // Get like counts for all animations
    const likeCounts = await AnimationReaction.aggregate([
      { $match: { isLiked: true } },
      { $group: { _id: "$animationId", count: { $sum: 1 } } },
    ]);

    const likeCountMap = likeCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item.count;
      return acc;
    }, {});

    // Enhance animations with like data
    const enhancedAnimations = allAnimations.map((animation) => {
      const animationId = animation._id.toString();
      return {
        ...animation.toObject(),
        likeCount: likeCountMap[animationId] || 0,
        isLiked: userId ? userReactions[animationId] === true : undefined,
      };
    });

    return res.status(200).json({
      success: true,
      animations: enhancedAnimations,
      count: enhancedAnimations.length,
    });
  } catch (error) {
    console.error("Error fetching all animations:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch all animations" });
  }
};

exports.createAnimation = async (req, res) => {
  try {
    const { title, frames = [] } = req.body;
    const userId = req.user.uid; // Extract userId from the authenticated user

    // Validate input data
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide userId." });
    }

    // Create a new animation document
    const newAnimation = new Animation({
      title,
      userId,
      frames,
      thumbnail: frames.length > 0 ? frames[0].data : "",
    });

    // Save the animation document to the database
    await newAnimation.save();

    return res.status(201).json({
      success: true,
      animation: newAnimation,
    });
  } catch (error) {
    console.error("Error creating animation:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create animation" });
  }
};

exports.updateAnimation = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;
    const { title, frames, thumbnail } = req.body;

    const animation = await Animation.findById(id);
    if (!animation) {
      return res
        .status(404)
        .json({ success: false, message: "Animation not found." });
    }
    if (animation.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this animation.",
      });
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
    return res
      .status(500)
      .json({ success: false, error: "Failed to update animation." });
  }
};

exports.deleteAnimation = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = req.user.uid;

    const animation = await Animation.findById(id);
    if (!animation) {
      return res
        .status(404)
        .json({ success: false, message: "Animation not found." });
    }
    if (animation.userId !== uid) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this animation.",
      });
    }

    await Animation.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ success: true, message: "Animation deleted successfully." });
  } catch (error) {
    console.error("Error deleting animation:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete animation." });
  }
};

exports.reactToAnimation = async (req, res) => {
  try {
    const { id } = req.params;
    const { isLiked } = req.body;
    const userId = req.user.uid;

    // Validate input
    if (typeof isLiked !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid input. isLiked must be a boolean value.",
      });
    }

    // Check if animation exists
    const animation = await Animation.findById(id);
    if (!animation) {
      return res.status(404).json({
        success: false,
        message: "Animation not found.",
      });
    }

    // Try to find existing reaction
    let existingReaction = await AnimationReaction.findOne({
      animationId: id,
      userId: userId,
    });

    if (existingReaction) {
      // If the same value is sent, remove the reaction
      if (existingReaction.isLiked === isLiked) {
        await AnimationReaction.findByIdAndDelete(existingReaction._id);
        return res.status(200).json({
          success: true,
          message: "Reaction removed successfully.",
          isLiked: null,
        });
      }
      // If different value, update it
      existingReaction.isLiked = isLiked;
      await existingReaction.save();
    } else {
      // Create new reaction
      existingReaction = await AnimationReaction.create({
        animationId: id,
        userId: userId,
        isLiked: isLiked,
      });
    }

    // Get updated like count
    const likeCount = await AnimationReaction.countDocuments({
      animationId: id,
      isLiked: true,
    });

    return res.status(200).json({
      success: true,
      message: "Reaction updated successfully.",
      isLiked: existingReaction.isLiked,
      likeCount: likeCount,
    });
  } catch (error) {
    console.error("Error updating animation reaction:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update animation reaction.",
    });
  }
};

exports.updateTopLikedAnimations = async (req, res) => {
    try {
        // Get top 8 most liked animations
        const topAnimations = await AnimationReaction.aggregate([
            { $match: { isLiked: true } },
            { $group: { 
                _id: "$animationId", 
                likeCount: { $sum: 1 } 
            }},
            { $sort: { likeCount: -1 } },
            { $limit: 8 }
        ]);

        // Get full animation details
        const animationIds = topAnimations.map(a => a._id);
        const animations = await Animation.find({ _id: { $in: animationIds } });

        // Create the top liked animations document
        const topLikedAnimations = await TopLikedAnimation.create({
            animations: topAnimations.map(ta => ({
                animationId: ta._id,
                likeCount: ta.likeCount
            }))
        });

        return res.status(200).json({
            success: true,
            message: "Top liked animations updated successfully",
            topLikedAnimations
        });
    } catch (error) {
        console.error("Error updating top liked animations:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Failed to update top liked animations" 
        });
    }
}

exports.getTopLikedAnimations = async (req, res) => {
    try {
        const userId = req.user?.uid;

        // Get the most recent top liked animations
        const topLikedAnimations = await TopLikedAnimation.findOne()
            .sort({ createdAt: -1 })
            .populate('animations.animationId');

        if (!topLikedAnimations) {
            return res.status(404).json({
                success: false,
                message: "No top liked animations found"
            });
        }

        // If user is logged in, get their reactions
        let userReactions = {};
        if (userId) {
            const reactions = await AnimationReaction.find({ 
                userId,
                animationId: { $in: topLikedAnimations.animations.map(a => a.animationId) }
            });
            userReactions = reactions.reduce((acc, reaction) => {
                acc[reaction.animationId.toString()] = reaction.isLiked;
                return acc;
            }, {});
        }

        // Enhance animations with user's like status
        const enhancedAnimations = topLikedAnimations.animations.map(item => {
            const animation = item.animationId.toObject();
            return {
                ...animation,
                likeCount: item.likeCount,
                isLiked: userId ? (userReactions[animation._id.toString()] === true) : undefined
            };
        });

        return res.status(200).json({
            success: true,
            animations: enhancedAnimations,
            count: enhancedAnimations.length
        });
    } catch (error) {
        console.error("Error fetching top liked animations:", error);
        return res.status(500).json({ 
            success: false, 
            error: "Failed to fetch top liked animations" 
        });
    }
}
