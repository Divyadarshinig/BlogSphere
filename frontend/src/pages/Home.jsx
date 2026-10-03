import { useEffect, useState } from "react";

import { getAllPosts } from "../services/api";
import PostCard from "../components/PostCard";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPosts = async () => {
        try {
            setLoading(true);

            const data = await getAllPosts();

            setPosts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = (postId) => {
        setPosts((currentPosts) =>
            currentPosts.filter(
                (post) => post._id !== postId
            )
        );
    };

    if (loading) {
        return (
            <main>
                <p>Loading posts...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <p style={{ color: "red" }}>
                    Error: {error}
                </p>
            </main>
        );
    }

    return (
        <main>
            {/* Hero Section */}

            <section className="hero">
                <div className="hero-content">
                    <p className="hero-label">
                        WELCOME TO BLOGSPHERE
                    </p>

                    <h1>
                        Ideas worth sharing.
                        <br />
                        Stories worth reading.
                    </h1>

                    <p className="hero-description">
                        Discover thoughtful stories, share your
                        ideas, and connect with a community of
                        writers.
                    </p>
                </div>
            </section>

            {/* Posts Section */}

            <section className="posts-section">
                <div className="section-heading">
                    <div>
                        <p className="section-label">
                            EXPLORE
                        </p>

                        <h2>Latest Stories</h2>
                    </div>

                    <p>
                        Fresh ideas from the BlogSphere
                        community.
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="empty-state">
                        <h3>No posts yet</h3>

                        <p>
                            Be the first person to share a
                            story.
                        </p>
                    </div>
                ) : (
                    <div className="posts-grid">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;