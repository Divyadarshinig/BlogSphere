const express = require("express");

const {
    addComment,
    getComments,
    deleteComment
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get comments for a post
router.get("/post/:postId", getComments);

// Add comment to a post - protected
router.post("/post/:postId", protect, addComment);

// Delete comment - protected
router.delete("/:id", protect, deleteComment);

module.exports = router;