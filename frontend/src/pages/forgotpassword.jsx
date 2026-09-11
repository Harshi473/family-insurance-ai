import React, { useState } from "react";

function ForgotPassword({ onBack, onLogin }) {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [developmentOtp, setDevelopmentOtp] = useState("");

  const [loading, setLoading] = useState(false);


  // =====================================================
  // STEP 1 - SEND OTP
  // =====================================================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to generate OTP."
        );
      }

      setMessage(
        "OTP generated successfully. Please enter the OTP below."
      );

      // Development/testing only.
      // The backend currently returns the OTP
      // because email sending has not been connected yet.
      if (data.developmentOtp) {
        setDevelopmentOtp(data.developmentOtp);
      }

      setStep(2);

    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        err.message ||
        "Unable to send OTP. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // STEP 2 - VERIFY OTP
  // =====================================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Invalid OTP."
        );
      }

      setMessage(
        "OTP verified successfully. Create your new password."
      );

      setStep(3);

    } catch (err) {
      console.error("OTP verification error:", err);

      setError(
        err.message ||
        "Unable to verify OTP."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // STEP 3 - RESET PASSWORD
  // =====================================================

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (!confirmPassword) {
      setError("Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to reset password."
        );
      }

      setMessage(
        "Password reset successfully! You can now login."
      );

      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        onLogin();
      }, 1500);

    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err.message ||
        "Unable to reset password."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // BACK BUTTON
  // =====================================================

  const handleBackStep = () => {
    setError("");
    setMessage("");

    if (step === 2) {
      setStep(1);
      setOtp("");
      setDevelopmentOtp("");
    } else if (step === 3) {
      setStep(2);
      setNewPassword("");
      setConfirmPassword("");
    } else {
      onBack();
    }
  };


  // =====================================================
  // UI
  // =====================================================

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


        {/* STEP INDICATOR */}

        <div className="password-steps">

          <div
            className={
              step >= 1
                ? "password-step active"
                : "password-step"
            }
          >
            <span>1</span>
            <small>Email</small>
          </div>

          <div className="password-step-line"></div>

          <div
            className={
              step >= 2
                ? "password-step active"
                : "password-step"
            }
          >
            <span>2</span>
            <small>OTP</small>
          </div>

          <div className="password-step-line"></div>

          <div
            className={
              step >= 3
                ? "password-step active"
                : "password-step"
            }
          >
            <span>3</span>
            <small>Password</small>
          </div>

        </div>


        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (

          <>
            <div className="auth-heading">

              <p className="section-label">
                FAMILYCARE ACCOUNT
              </p>

              <h1>
                Forgot Password?
              </h1>

              <p>
                Enter the email address associated with
                your FamilyCare account and we will
                generate a verification OTP.
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={handleSendOtp}
            >

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
                  ? "Generating OTP..."
                  : "Send OTP"}
              </button>

            </form>
          </>

        )}


        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (

          <>
            <div className="auth-heading">

              <p className="section-label">
                VERIFY YOUR ACCOUNT
              </p>

              <h1>
                Enter OTP
              </h1>

              <p>
                Enter the 6-digit OTP generated for
                your FamilyCare account.
              </p>

            </div>


            {/* DEVELOPMENT OTP */}

            {developmentOtp && (

              <div className="development-otp-box">

                <span>
                  Development OTP
                </span>

                <strong>
                  {developmentOtp}
                </strong>

                <small>
                  Email delivery will be connected
                  before production deployment.
                </small>

              </div>

            )}


            <form
              className="auth-form"
              onSubmit={handleVerifyOtp}
            >

              <div className="form-group">

                <label>
                  6-Digit OTP
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  placeholder="Enter 6-digit OTP"
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
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

            </form>
          </>

        )}


        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (

          <>
            <div className="auth-heading">

              <p className="section-label">
                CREATE NEW PASSWORD
              </p>

              <h1>
                Reset Password
              </h1>

              <p>
                Create a new password for your
                FamilyCare account.
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={handleResetPassword}
            >

              <div className="form-group">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                />

              </div>


              <div className="form-group">

                <label>
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                />

              </div>


              <p className="password-hint">
                Password must contain at least 6 characters.
              </p>


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
                  ? "Resetting Password..."
                  : "Reset Password"}
              </button>

            </form>
          </>

        )}


        {/* FOOTER LINKS */}

        <div className="auth-links">

          <p>
            Remember your password?
          </p>

          <button
            type="button"
            className="auth-link-btn"
            onClick={onLogin}
          >
            Back to Login
          </button>

        </div>


        <button
          type="button"
          className="auth-back-btn"
          onClick={handleBackStep}
        >
          ← Back
        </button>

      </div>

    </div>
  );
}

export default ForgotPassword;