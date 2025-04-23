const express = require("express");

const {
  getAllAnimations,
  createAnimation,
  updateAnimation,
  deleteAnimation,
  reactToAnimation,
} = require("../controllers/animationController");
const { protect } = require("../middleware/auth");
const { optionalAuth } = require("../middleware/optionalAuth");
const router = express.Router();

router.get("/", optionalAuth, getAllAnimations);
router.post("/", protect, createAnimation);

// new route to upload one image (base64) and append it
router.put("/:id", protect, updateAnimation);
router.delete("/:id", protect, deleteAnimation);

router.post("/:id/react", protect, reactToAnimation);

module.exports = router;
