const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the Mongoose schema for the `Chat` model
const AnimationSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "Please provide a user ID."],
    },
    name: {
        type: String,
        default: "Untitled Animation",
    },
    imageList: {
      type: [String],     // mongoose list of string to the firebase storage URL.
      default: []
    }
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);


module.exports = mongoose.model("Animation", AnimationSchema);