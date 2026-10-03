import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createPost } from "../services/api";
import { useAuth } from "../context/AuthContext";

function CreatePost() {
    const navigate = useNavigate();
    const { token, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        content: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isAuthenticated) {
        return (
            <main className="editor-page">
                <div className="editor-message">
                    <h1>Please login to create a post.</h1>
                </div>
            </main>
        );
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !formData.title.trim() ||
            !formData.content.trim()
        ) {
            setError(
                "Please provide both a title and content."
            );
            return;
        }

        setLoading(true);

        try {
            await createPost(formData, token);

            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="editor-page">

            <div className="editor-header">
                <p className="section-label">
                    WRITE SOMETHING NEW
                </p>

                <h1>Create a new story</h1>

                <p>
                    Share your ideas, experiences, and
                    perspectives with the BlogSphere community.
                </p>
            </div>

            {error && (
                <div className="editor-error">
                    {error}
                </div>
            )}

            <form
                className="editor-form"
                onSubmit={handleSubmit}
            >

                <div className="editor-group">
                    <label htmlFor="title">
                        Title
                    </label>

                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Give your story a title..."
                        required
                    />
                </div>

                <div className="editor-group">
                    <label htmlFor="content">
                        Story
                    </label>

                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Start writing your story..."
                        rows="18"
                        required
                    />
                </div>

                <div className="editor-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate("/")}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Publishing..."
                            : "Publish Story"}
                    </button>
                </div>

            </form>

        </main>
    );
}

export default CreatePost;