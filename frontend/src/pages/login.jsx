import React, { useState } from "react";

function Login({ onBack, onSignUp, onLoginSuccess, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://family-insurance-ai.onrender.com/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      setEmail("");
      setPassword("");

      onLoginSuccess(data.user);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message ||
        "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* LOGO */}
        <div className="auth-logo">

          <div className="logo-shield">
            <span>♡</span>
          </div>

          <div>
            <h2>
              Family<span>Care</span>
            </h2>

            <p>
              Secure Today • Healthy Tomorrow
            </p>
          </div>

        </div>


        {/* HEADING */}
        <div className="auth-heading">

          <p className="section-label">
            FAMILYCARE ACCOUNT
          </p>

          <h1>
            Welcome Back
          </h1>

          <p>
            Login to your FamilyCare account to access
            your family information and insurance
            recommendations.
          </p>

        </div>


        {/* LOGIN FORM */}
        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}
          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
            />

          </div>


          {/* PASSWORD */}
          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
            />

          </div>


          {/* FORGOT PASSWORD */}
          <div className="forgot-password-row">

            <button
              type="button"
              className="forgot-password-btn"
              onClick={onForgotPassword}
            >
              Forgot Password?
            </button>

          </div>


          {/* ERROR */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >

            {loading
              ? "Logging In..."
              : "Login"}

          </button>

        </form>


        {/* SIGN UP */}
        <div className="auth-links">

          <p>
            Don't have an account?
          </p>

          <button
            type="button"
            className="auth-link-btn"
            onClick={onSignUp}
          >
            Sign Up
          </button>

        </div>


        {/* BACK */}
        <button
          type="button"
          className="auth-back-btn"
          onClick={onBack}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default Login;