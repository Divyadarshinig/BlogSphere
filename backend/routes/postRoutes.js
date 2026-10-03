const express = require("express");

const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
} = require("../controllers/postController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all posts
router.get("/", getAllPosts);

// Get single post
router.get("/:id", getPostById);

// Create post - protected
router.post("/", protect, createPost);

// Update post - protected
router.put("/:id", protect, updatePost);

// Delete post - protected
router.delete("/:id", protect, deletePost);

module.exports = router;