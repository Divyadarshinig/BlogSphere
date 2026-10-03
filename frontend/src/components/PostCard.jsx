import { Link, useNavigate } from "react-router-dom";

import { deletePost } from "../services/api";
import { useAuth } from "../context/AuthContext";

function PostCard({ post, onDelete }) {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const isAuthor =
        user?.id === post.author?._id;

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePost(post._id, token);

            if (onDelete) {
                onDelete(post._id);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <article className="post-card">
            <div className="post-card-content">

                <div className="post-meta">
                    <span>
                        {post.author?.name || "Unknown"}
                    </span>

                    <span>•</span>

                    <span>
                        {new Date(
                            post.createdAt
                        ).toLocaleDateString()}
                    </span>
                </div>

                <h2>{post.title}</h2>

                <p>
                    {post.content.length > 150
                        ? `${post.content.substring(
                              0,
                              150
                          )}...`
                        : post.content}
                </p>

                <Link
                    className="read-more"
                    to={`/post/${post._id}`}
                >
                    Read Article →
                </Link>

                {isAuthor && (
                    <div className="post-actions">
                        <button
                            onClick={() =>
                                navigate(
                                    `/edit-post/${post._id}`
                                )
                            }
                        >
                            Edit
                        </button>

                        <button
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}

export default PostCard;