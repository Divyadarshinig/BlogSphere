import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getPostById,
    updatePost
} from "../services/api";

import { useAuth } from "../context/AuthContext";

function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user, token, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        content: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await getPostById(id);

                if (post.author?._id !== user?.id) {
                    setError(
                        "You are not authorized to edit this post."
                    );
                    return;
                }

                setFormData({
                    title: post.title,
                    content: post.content
                });
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchPost();
        } else {
            setLoading(false);
        }
    }, [id, user, isAuthenticated]);

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

        setSaving(true);

        try {
            await updatePost(id, formData, token);

            navigate(`/post/${id}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="editor-page">
                <div className="editor-message">
                    <h1>Please login to edit this post.</h1>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="editor-page">
                <div className="editor-message">
                    <h1>Loading your story...</h1>
                </div>
            </main>
        );
    }

    if (error && !formData.title) {
        return (
            <main className="editor-page">
                <div className="editor-message">
                    <h1>{error}</h1>
                </div>
            </main>
        );
    }

    return (
        <main className="editor-page">

            <div className="editor-header">
                <p className="section-label">
                    EDIT YOUR STORY
                </p>

                <h1>Make your story better</h1>

                <p>
                    Update your article and keep your
                    ideas fresh for the BlogSphere community.
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
                        placeholder="Write your story..."
                        rows="18"
                        required
                    />
                </div>

                <div className="editor-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            navigate(`/post/${id}`)
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving Changes..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </main>
    );
}

export default EditPost;