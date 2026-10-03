import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    getAllPosts,
    deletePost
} from "../services/api";

import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user, token, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);

                const data = await getAllPosts();

                const userPosts = data.filter(
                    (post) =>
                        post.author?._id === user?.id
                );

                setPosts(userPosts);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchPosts();
        } else {
            setLoading(false);
        }
    }, [user, isAuthenticated]);

    const handleDelete = async (postId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deletePost(postId, token);

            setPosts((currentPosts) =>
                currentPosts.filter(
                    (post) => post._id !== postId
                )
            );
        } catch (error) {
            alert(error.message);
        }
    };

    if (!isAuthenticated) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-message">
                    <h1>Please login to view your dashboard.</h1>

                    <Link to="/login">
                        Go to Login →
                    </Link>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-message">
                    Loading your dashboard...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-error">
                    Error: {error}
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-page">

            {/* Dashboard Header */}

            <section className="dashboard-header">

                <div>
                    <p className="section-label">
                        YOUR BLOGSPACE
                    </p>

                    <h1>
                        Welcome, {user?.name}
                    </h1>

                    <p>
                        Manage your stories and keep track
                        of everything you've shared.
                    </p>
                </div>

                <Link
                    className="dashboard-create-button"
                    to="/create-post"
                >
                    + Write a Story
                </Link>

            </section>

            {/* Stats */}

            <section className="dashboard-stats">

                <div className="stat-card">
                    <span className="stat-number">
                        {posts.length}
                    </span>

                    <span className="stat-label">
                        Published Stories
                    </span>
                </div>

                <div className="stat-card">
                    <span className="stat-number">
                        {user?.name?.charAt(0).toUpperCase()}
                    </span>

                    <span className="stat-label">
                        Your Profile
                    </span>
                </div>

            </section>

            {/* Profile */}

            <section className="profile-card">

                <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h3>{user?.name}</h3>

                    <p>{user?.email}</p>
                </div>

            </section>

            {/* Posts */}

            <section className="dashboard-posts">

                <div className="dashboard-section-heading">
                    <div>
                        <p className="section-label">
                            YOUR STORIES
                        </p>

                        <h2>Published Posts</h2>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <div className="dashboard-empty">
                        <h3>You haven't published anything yet.</h3>

                        <p>
                            Start your first story and share
                            your ideas with the community.
                        </p>

                        <Link to="/create-post">
                            Write your first story →
                        </Link>
                    </div>
                ) : (
                    <div className="dashboard-post-list">

                        {posts.map((post) => (
                            <article
                                className="dashboard-post"
                                key={post._id}
                            >
                                <div className="dashboard-post-content">

                                    <p className="dashboard-post-date">
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleDateString(
                                            undefined,
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            }
                                        )}
                                    </p>

                                    <h3>
                                        {post.title}
                                    </h3>

                                    <p>
                                        {post.content.length > 180
                                            ? `${post.content.substring(
                                                  0,
                                                  180
                                              )}...`
                                            : post.content}
                                    </p>
                                </div>

                                <div className="dashboard-post-actions">

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/post/${post._id}`
                                            )
                                        }
                                    >
                                        View
                                    </button>

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
                                        className="dashboard-delete"
                                        onClick={() =>
                                            handleDelete(
                                                post._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>
                            </article>
                        ))}

                    </div>
                )}

            </section>

        </main>
    );
}

export default Dashboard;