const API_URL = "https://blogsphere-backend-9va4.onrender.com/api";

// Generic API request helper
const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

// ===============================
// AUTH
// ===============================

// Register
export const registerUser = async (userData) => {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
    });
};

// Login
export const loginUser = async (userData) => {
    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(userData)
    });
};


// ===============================
// POSTS
// ===============================

// Get all posts
export const getAllPosts = async () => {
    return apiRequest("/posts");
};

// Get single post
export const getPostById = async (postId) => {
    return apiRequest(`/posts/${postId}`);
};

// Create post
export const createPost = async (postData, token) => {
    return apiRequest("/posts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(postData)
    });
};

// Update post
export const updatePost = async (postId, postData, token) => {
    return apiRequest(`/posts/${postId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(postData)
    });
};

// Delete post
export const deletePost = async (postId, token) => {
    return apiRequest(`/posts/${postId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


// ===============================
// COMMENTS
// ===============================

// Get comments
export const getComments = async (postId) => {
    return apiRequest(`/comments/post/${postId}`);
};

// Add comment
export const addComment = async (postId, content, token) => {
    return apiRequest(`/comments/post/${postId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            content: content
        })
    });
};

// Delete comment
export const deleteComment = async (commentId, token) => {
    return apiRequest(`/comments/${commentId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};