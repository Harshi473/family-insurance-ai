import React, { useState } from "react";
import "./App.css";

import AIChatbot from "./components/AIChatbot";

import FamilyDetails from "./pages/familydetails.jsx";
import Recommendation from "./pages/Recommendation.jsx";
import PlanDetails from "./pages/PlanDetails.jsx";
import SignUp from "./pages/signup.jsx";
import Login from "./pages/login.jsx";
import Profile from "./pages/profile.jsx";
import ForgotPassword from "./pages/forgotpassword.jsx";

function App() {
  const [page, setPage] = useState("home");
  const [familyData, setFamilyData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // =========================
  // FAMILY DATA
  // =========================

  const handleContinue = (data) => {
    console.log("Family Data received:", data);

    setFamilyData(data);
    setPage("recommendation");
  };

  // =========================
  // PLAN DETAILS
  // =========================

  const handleViewPlan = (plan) => {
    console.log("Selected Plan:", plan);

    setSelectedPlan(plan);
    setPage("planDetails");
  };

  // =========================
  // NAVIGATION
  // =========================

  const goToHome = () => {
    setPage("home");
  };

  const goToLogin = () => {
    setPage("login");
  };

  const goToSignUp = () => {
    setPage("signup");
  };

  const goToForgotPassword = () => {
    setPage("forgotPassword");
  };

  const goToProfile = () => {
    setPage("profile");
  };

  const goToDetails = () => {
    if (!loggedInUser) {
      setPage("login");
      return;
    }

    setPage("details");
  };

  const goToRecommendations = () => {
    setPage("recommendation");
  };

  // =========================
  // LOGIN
  // =========================

  const handleLoginSuccess = (user) => {
    console.log("Logged in user:", user);

    setLoggedInUser(user);
    setPage("profile");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    console.log("User logged out");

    setLoggedInUser(null);
    setFamilyData(null);
    setSelectedPlan(null);

    setPage("home");
  };

  // =========================
  // AI CHATBOT
  // =========================

  const chatbot = (
    <AIChatbot familyData={familyData} />
  );

  // =========================
  // SIGN UP PAGE
  // =========================

  if (page === "signup") {
    return (
      <>
        <SignUp
          onBack={goToHome}
          onLogin={goToLogin}
        />

        {chatbot}
      </>
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================

  if (page === "login") {
    return (
      <>
        <Login
          onBack={goToHome}
          onSignUp={goToSignUp}
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={goToForgotPassword}
        />

        {chatbot}
      </>
    );
  }

  // =========================
  // FORGOT PASSWORD PAGE
  // =========================

  if (page === "forgotPassword") {
    return (
      <>
        <ForgotPassword
          onBack={goToHome}
          onLogin={goToLogin}
        />

        {chatbot}
      </>
    );
  }

  // =========================
  // PROFILE PAGE
  // =========================

  if (page === "profile") {
    return (
      <>
        <Profile
          user={loggedInUser}
          onContinue={goToDetails}
          onLogout={handleLogout}
        />

        {chatbot}
      </>
    );
  }

  // =========================
  // FAMILY DETAILS PAGE
  // =========================

  if (page === "details") {
    return (
      <>
        <FamilyDetails
          user={loggedInUser}
          onBack={goToHome}
          onContinue={handleContinue}
        />

        {chatbot}
      </>
    );
  }

  // =========================
  // RECOMMENDATION PAGE
  // =========================

  if (page === "recommendation") {
    return (
      <>
        <Recommendation
          familyData={familyData}
          onBack={() => setPage("details")}
          onViewPlan={handleViewPlan}
        />

        {chatbot}
      </>
    );
  }

  // =========================
  // PLAN DETAILS PAGE
  // =========================

  if (page === "planDetails") {
    return (
      <>
        <PlanDetails
          plan={selectedPlan}
          onBack={goToRecommendations}
        />

        {chatbot}
      </>
    );
  }

  // =========================
  // HOME PAGE
  // =========================

  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">

        <div className="logo-section">

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

        <nav className="nav-links">

          <a
            href="#home"
            className="active"
          >
            Home
          </a>

          <a href="#plans">
            Insurance Plans
          </a>

          <a href="#about">
            About
          </a>

          <a href="#contact">
            Contact
          </a>

        </nav>

        <div className="auth-buttons">

          {loggedInUser ? (

            <button
              className="login-btn"
              onClick={goToProfile}
            >
              👤 {loggedInUser.name}
            </button>

          ) : (

            <>
              <button
                className="login-btn"
                onClick={goToLogin}
              >
                Login
              </button>

              <button
                className="signup-btn"
                onClick={goToSignUp}
              >
                Sign Up
              </button>
            </>

          )}

        </div>

      </header>

      {/* =========================
          HERO
      ========================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="small-heading">
            FAMILY INSURANCE AI
          </p>

          <h1>
            Better Health Coverage
            <br />
            for a <span>Brighter Future</span>
          </h1>

          <p className="hero-description">
            Get personalized health insurance recommendations
            for your family using the power of AI. Simple,
            smart and secure.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={goToDetails}
            >
              Get Started <span>→</span>
            </button>

            <button className="secondary-btn">
              Learn More
            </button>

          </div>

        </div>

        {/* =========================
            NEW FAMILY IMAGE
        ========================= */}

        <div className="hero-image">

          <img
            src="/family.png"
            alt="FamilyCare family"
            className="family-photo"
          />

        </div>

      </section>

      {/* =========================
          TRUST SECTION
      ========================= */}

      <section className="trust-section">

        <div className="trust-card">

          <div className="trust-icon blue">
            🛡️
          </div>

          <div>
            <h3>
              Trusted & Secure
            </h3>

            <p>
              Your data is always protected
            </p>
          </div>

        </div>

        <div className="trust-card">

          <div className="trust-icon purple">
            🧠
          </div>

          <div>
            <h3>
              AI Powered
            </h3>

            <p>
              Smart recommendations for your family
            </p>
          </div>

        </div>

        <div className="trust-card">

          <div className="trust-icon green">
            💚
          </div>

          <div>
            <h3>
              Suitable Coverage
            </h3>

            <p>
              Compare plans and find a suitable fit
            </p>
          </div>

        </div>

        <div className="trust-card">

          <div className="trust-icon orange">
            👨‍👩‍👧
          </div>

          <div>
            <h3>
              For Every Family
            </h3>

            <p>
              Health, security and peace of mind
            </p>
          </div>

        </div>

      </section>

      {/* =========================
          PLANS
      ========================= */}

      <section
        className="plans-section"
        id="plans"
      >

        <p className="section-label">
          OUR INSURANCE PLANS
        </p>

        <h2>
          Explore Family Insurance Options
        </h2>

        <div className="section-line"></div>

        <div className="plan-cards">

          <div className="plan-card">

            <h3>
              Family Basic
            </h3>

            <p className="coverage">
              ₹5,00,000
            </p>

            <p>
              Coverage Amount
            </p>

            <div className="plan-price">
              ₹1,500 <span>/ month</span>
            </div>

            <button>
              View Plan
            </button>

          </div>

          <div className="plan-card recommended">

            <div className="recommended-badge">
              Popular Choice
            </div>

            <h3>
              Family Plus
            </h3>

            <p className="coverage">
              ₹10,00,000
            </p>

            <p>
              Coverage Amount
            </p>

            <div className="plan-price">
              ₹2,500 <span>/ month</span>
            </div>

            <button>
              View Plan
            </button>

          </div>

          <div className="plan-card">

            <h3>
              Family Premium
            </h3>

            <p className="coverage">
              ₹20,00,000
            </p>

            <p>
              Coverage Amount
            </p>

            <div className="plan-price">
              ₹4,500 <span>/ month</span>
            </div>

            <button>
              View Plan
            </button>

          </div>

        </div>

      </section>

      {/* =========================
          ABOUT
      ========================= */}

      <section
        className="about-section"
        id="about"
      >

        <p className="section-label">
          ABOUT FAMILYCARE
        </p>

        <h2>
          Smarter Insurance Decisions for Your Family
        </h2>

        <p>
          FamilyCare uses AI-assisted recommendations
          to help families understand their insurance
          needs and compare suitable coverage options
          in one place.
        </p>

      </section>

      {/* =========================
          CONTACT
      ========================= */}

      <section
        className="contact-section"
        id="contact"
      >

        <h2>
          Protect What Matters Most
        </h2>

        <p>
          Start your family insurance journey today.
        </p>

        <button
          className="primary-btn"
          onClick={goToDetails}
        >
          Get Started <span>→</span>
        </button>

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <div>

          <h3>
            Family<span>Care</span>
          </h3>

          <p>
            Secure Today • Healthy Tomorrow
          </p>

        </div>

        <p>
          © 2026 FamilyCare. All rights reserved.
        </p>

      </footer>

      {/* =========================
          AI CHATBOT
      ========================= */}

      {chatbot}

    </div>
  );
}

export default App;