import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getPostById } from "../services/api";
import CommentSection from "../components/CommentSection";

function PostDetails() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPostById(id);

                setPost(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <main className="article-page">
                <div className="article-loading">
                    Loading article...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="article-page">
                <div className="article-error">
                    Error: {error}
                </div>
            </main>
        );
    }

    if (!post) {
        return (
            <main className="article-page">
                <div className="article-error">
                    Post not found.
                </div>
            </main>
        );
    }

    return (
        <main className="article-page">

            {/* Article Header */}

            <article className="article">

                <div className="article-header">

                    <p className="section-label">
                        BLOGSPHERE ARTICLE
                    </p>

                    <h1>{post.title}</h1>

                    <div className="article-meta">
                        <span>
                            By{" "}
                            <strong>
                                {post.author?.name || "Unknown"}
                            </strong>
                        </span>

                        <span>•</span>

                        <span>
                            {new Date(
                                post.createdAt
                            ).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </span>
                    </div>

                </div>

                {/* Article Content */}

                <div className="article-content">
                    {post.content
                        .split("\n")
                        .map((paragraph, index) => (
                            <p key={index}>
                                {paragraph}
                            </p>
                        ))}
                </div>

            </article>

            {/* Comments */}

            <section className="comments-wrapper">
                <CommentSection postId={post._id} />
            </section>

            {/* Back Link */}

            <div className="back-to-home">
                <Link to="/">
                    ← Back to all stories
                </Link>
            </div>

        </main>
    );
}

export default PostDetails;