import { useEffect, useState } from "react";

import {
    getComments,
    addComment,
    deleteComment
} from "../services/api";

import { useAuth } from "../context/AuthContext";

function CommentSection({ postId }) {
    const { user, token, isAuthenticated } = useAuth();

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getComments(postId);

            setComments(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            return;
        }

        try {
            setError("");
            setSubmitting(true);

            await addComment(
                postId,
                content,
                token
            );

            setContent("");

            await fetchComments();
        } catch (error) {
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        const confirmed = window.confirm(
            "Delete this comment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteComment(
                commentId,
                token
            );

            setComments((currentComments) =>
                currentComments.filter(
                    (comment) =>
                        comment._id !== commentId
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <section className="comments-section">

            <div className="comments-heading">
                <p className="section-label">
                    DISCUSSION
                </p>

                <h2>
                    Comments
                    <span>
                        {" "}
                        ({comments.length})
                    </span>
                </h2>
            </div>

            {isAuthenticated ? (
                <form
                    className="comment-form"
                    onSubmit={handleSubmit}
                >
                    <textarea
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                        placeholder="Share your thoughts..."
                        rows="4"
                    />

                    <div className="comment-form-actions">
                        <span>
                            Be respectful and constructive.
                        </span>

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                !content.trim()
                            }
                        >
                            {submitting
                                ? "Posting..."
                                : "Post Comment"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="comment-login-message">
                    <p>
                        Please{" "}
                        <a href="/login">
                            sign in
                        </a>{" "}
                        to join the discussion.
                    </p>
                </div>
            )}

            {error && (
                <div className="comment-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="comments-loading">
                    Loading comments...
                </div>
            ) : comments.length === 0 ? (
                <div className="no-comments">
                    <h3>No comments yet</h3>

                    <p>
                        Be the first to share your thoughts.
                    </p>
                </div>
            ) : (
                <div className="comments-list">

                    {comments.map((comment) => (
                        <article
                            className="comment-card"
                            key={comment._id}
                        >
                            <div className="comment-avatar">
                                {comment.author?.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="comment-body">

                                <div className="comment-header">
                                    <div>
                                        <strong>
                                            {comment.author?.name ||
                                                "Unknown"}
                                        </strong>

                                        <span>
                                            {new Date(
                                                comment.createdAt
                                            ).toLocaleDateString(
                                                undefined,
                                                {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric"
                                                }
                                            )}
                                        </span>
                                    </div>

                                    {user?.id ===
                                        comment.author?._id && (
                                        <button
                                            className="comment-delete"
                                            onClick={() =>
                                                handleDelete(
                                                    comment._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>

                                <p>
                                    {comment.content}
                                </p>

                            </div>
                        </article>
                    ))}

                </div>
            )}

        </section>
    );
}

export default CommentSection;