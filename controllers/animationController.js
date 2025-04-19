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
        const { imageList = [] } = req.body;
        const userId = req.user.uid; // Extract userId from the authenticated user

        // Validate input data
        if (!userId || !imageList) {
            return res.status(400).json({ success: false, message: "Please provide userId and imageList." });
        }

        // Create a new animation document
        const newAnimation = new Animation({
            userId,
            imageList,
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
      const { imageData } = req.body;  // base64 string
  
      if (!imageData) {
        return res.status(400).json({ success: false, message: "No imageData provided." });
      }
  
      const animation = await Animation.findById(id);
      if (!animation) {
        return res.status(404).json({ success: false, message: "Animation not found." });
      }
      if (animation.userId !== uid) {
        return res.status(403).json({ success: false, message: "Not authorized to update this animation." });
      }
  
      // parse the base64 data
      const matches = imageData.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ success: false, message: "Invalid imageData format." });
      }
      const contentType = matches[1];
      const base64Encoded = matches[2];
      const buffer = Buffer.from(base64Encoded, "base64");
  
      // upload to Firebase Storage
      const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      const bucket = admin.storage().bucket(bucketName);
      const extension = contentType.split("/")[1];
      const filePath = `animations/${id}/${Date.now()}.${extension}`;
      const file = bucket.file(filePath);
  
      await file.save(buffer, { metadata: { contentType } });
      await file.makePublic();  // so URL is publicly readable
  
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filePath}`;
  
      // append to imageList and save
      animation.imageList.push(publicUrl);
      await animation.save();
  
      return res.status(200).json({ success: true, animation });
    } catch (error) {
      console.error("Error updating animation:", error);
      return res.status(500).json({ success: false, error: "Failed to update animation." });
    }
  };