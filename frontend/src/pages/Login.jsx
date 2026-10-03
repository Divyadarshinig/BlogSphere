import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(formData);

            login(data.user, data.token);

            navigate("/");
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-container">

                <div className="auth-header">
                    <p className="section-label">
                        WELCOME BACK
                    </p>

                    <h1>Sign in to BlogSphere</h1>

                    <p>
                        Continue sharing ideas and discovering
                        stories from the community.
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        className="auth-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">
                        Create one
                    </Link>
                </p>

            </div>
        </main>
    );
}

export default Login;