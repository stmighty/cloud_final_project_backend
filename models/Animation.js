const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Frame sub-schema
const FrameSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  data: {
    type: String,
    default: null
  }
});

// Define the Mongoose schema for the `Animation` model
const AnimationSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "Please provide a user ID."],
    },
    title: {
      type: String,
      default: "Untitled Animation",
    },
    frames: {
      type: [FrameSchema],
      default: []
    },
    thumbnail: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

module.exports = mongoose.model("Animation", AnimationSchema);