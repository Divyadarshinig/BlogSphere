const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

// Add Comment
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { postId } = req.params;

        if (!content) {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        // Check if post exists
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = await Comment.create({
            content,
            post: postId,
            author: req.userId
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate("author", "name email");

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });

    } catch (error) {
        console.error("Add comment error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get Comments for a Post
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        console.log("Received postId:", JSON.stringify(postId));
        console.log("postId length:", postId.length);

        const comments = await Comment.find({
            post: postId.trim()
        })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);

    } catch (error) {
        console.error("Get comments error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// Delete Comment
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Only the comment author can delete it
        if (comment.author.toString() !== req.userId) {
            return res.status(403).json({
                message: "You can only delete your own comments"
            });
        }

        await comment.deleteOne();

        res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("Delete comment error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    addComment,
    getComments,
    deleteComment
};