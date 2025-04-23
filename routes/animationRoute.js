const express = require("express");

const {
  getAllAnimations,
  createAnimation,
  updateAnimation,
  deleteAnimation,
  reactToAnimation,
  updateTopLikedAnimations,
  getTopLikedAnimations,
} = require("../controllers/animationController");
const { protect } = require("../middleware/auth");
const { optionalAuth } = require("../middleware/optionalAuth");
const { checkSecretToken } = require("../middleware/secretToken");
const router = express.Router();

router.get("/", optionalAuth, getAllAnimations);
router.post("/", protect, createAnimation);

// new route to upload one image (base64) and append it
router.put("/:id", protect, updateAnimation);
router.delete("/:id", protect, deleteAnimation);

router.post("/:id/react", protect, reactToAnimation);

// Top liked animations routes
router.get("/top-liked", optionalAuth, getTopLikedAnimations);
router.post("/update-top-liked", checkSecretToken, updateTopLikedAnimations);

module.exports = router;
