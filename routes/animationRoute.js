const express = require("express");

const {getAllAnimations, createAnimation, updateAnimation, deleteAnimation} = require("../controllers/animationController");
const {protect} = require("../middleware/auth");
const router = express.Router();


router.get("/", getAllAnimations);
router.post("/", protect, createAnimation);

// new route to upload one image (base64) and append it
router.put("/:id", protect, updateAnimation);
router.delete("/:id", protect, deleteAnimation);

module.exports = router;