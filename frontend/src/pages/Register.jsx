import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        setSuccess("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password.trim()
        ) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            await registerUser(formData);

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
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
                        JOIN BLOGSPHERE
                    </p>

                    <h1>Create your account</h1>

                    <p>
                        Start sharing your ideas and connect
                        with readers and writers.
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        {success}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    <button
                        className="auth-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">
                        Sign in
                    </Link>
                </p>

            </div>
        </main>
    );
}

export default Register;