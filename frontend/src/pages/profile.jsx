import React from "react";

function Profile({ user, onContinue, onLogout }) {
  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* LOGO */}

        <div className="profile-logo">

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


        {/* WELCOME */}

        <div className="profile-heading">

          <p className="section-label">
            FAMILYCARE ACCOUNT
          </p>

          <h1>
            Welcome, {user?.name || "User"}!
          </h1>

          <p>
            Your account has been successfully logged in.
            Manage your family insurance journey from here.
          </p>

        </div>


        {/* USER INFORMATION */}

        <div className="profile-info">

          <div className="profile-info-row">

            <div className="profile-icon">
              👤
            </div>

            <div>
              <span>
                Full Name
              </span>

              <strong>
                {user?.name || "Not available"}
              </strong>
            </div>

          </div>


          <div className="profile-info-row">

            <div className="profile-icon">
              📧
            </div>

            <div>
              <span>
                Email Address
              </span>

              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>

          </div>


          <div className="profile-info-row">

            <div className="profile-icon">
              🛡️
            </div>

            <div>
              <span>
                Account Status
              </span>

              <strong className="profile-active">
                Active
              </strong>
            </div>

          </div>

        </div>


        {/* NEXT STEP */}

        <div className="profile-action">

          <h3>
            Find the Right Insurance for Your Family
          </h3>

          <p>
            Enter your family details and let FamilyCare
            recommend suitable insurance plans for you.
          </p>


          <button
            className="profile-continue-btn"
            onClick={onContinue}
          >
            Continue to Family Details
            <span>→</span>
          </button>

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          className="profile-logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;