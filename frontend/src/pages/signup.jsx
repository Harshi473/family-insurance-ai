import React, { useState } from "react";

function SignUp({ onBack, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to create account."
        );
      }

      setMessage(
        "Account created successfully! You can now login."
      );

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

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

        <div className="auth-heading">
          <p className="section-label">
            FAMILYCARE ACCOUNT
          </p>

          <h1>
            Create Your Account
          </h1>

          <p>
            Create your FamilyCare account to save your
            family information and insurance recommendations.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="auth-links">

          <p>
            Already have an account?
          </p>

          <button
            type="button"
            className="auth-link-btn"
            onClick={onLogin}
          >
            Login
          </button>

        </div>

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

export default SignUp;