import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                <Link to="/">
                    Blog<span>Sphere</span>
                </Link>
            </div>

            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                {isAuthenticated ? (
                    <>
                        <Link to="/create-post">
                            Write
                        </Link>

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <span className="navbar-user">
                            {user?.name}
                        </span>

                        <button
                            className="navbar-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link
                            className="navbar-register"
                            to="/register"
                        >
                            Get Started
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;