const Post = require("../models/postModel");

// Create Post
const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Please provide title and content"
            });
        }

        const post = await Post.create({
            title,
            content,
            author: req.userId
        });

        res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error("Create post error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get All Posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {
        console.error("Get posts error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get Single Post
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.status(200).json(post);

    } catch (error) {
        console.error("Get post error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update Post
const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Only the author can update
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({
                message: "You can only edit your own posts"
            });
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();

        res.status(200).json({
            message: "Post updated successfully",
            post
        });

    } catch (error) {
        console.error("Update post error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Delete Post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        // Only the author can delete
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({
                message: "You can only delete your own posts"
            });
        }

        await post.deleteOne();

        res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error("Delete post error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};