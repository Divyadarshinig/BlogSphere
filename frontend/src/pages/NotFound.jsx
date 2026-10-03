import { Link } from "react-router-dom";

function NotFound() {
    return (
        <main className="not-found-page">
            <div className="not-found-content">

                <p className="section-label">
                    404 ERROR
                </p>

                <h1>Page not found.</h1>

                <p>
                    The page you're looking for doesn't exist
                    or may have been moved.
                </p>

                <Link to="/">
                    ← Back to BlogSphere
                </Link>

            </div>
        </main>
    );
}

export default NotFound;