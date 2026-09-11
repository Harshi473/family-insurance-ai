import React from "react";

const PlanDetails = ({ plan, onBack }) => {
  if (!plan) {
    return (
      <div className="plan-details-page">
        <div className="plan-details-empty">
          <div className="plan-details-empty-icon">📋</div>

          <h2>Plan details are not available</h2>

          <p>Please go back and select an insurance plan.</p>

          <button
            className="plan-details-primary-btn"
            onClick={onBack}
          >
            ← Back to Recommendations
          </button>
        </div>
      </div>
    );
  }

  const formatMoney = (amount) => {
    return (
      "Rs. " +
      Number(amount || 0).toLocaleString("en-IN")
    );
  };

  const companyName =
    plan.insurer_name || "Insurance Company";

  /* ================================
     AI MATCH SCORE
     ================================ */

  const aiMatchScore = Number(
    plan.ai_match_score ??
      plan.aiMatchScore ??
      0
  );

  const aiMatchLabel =
    plan.ai_match_label ||
    plan.aiMatchLabel ||
    (aiMatchScore >= 93
      ? "Excellent Match"
      : aiMatchScore >= 87
      ? "Strong Match"
      : aiMatchScore >= 80
      ? "Good Match"
      : "Suitable Option");

  /* ================================
     PREMIUM
     ================================ */

  const estimatedMonthlyPremium = Number(
    plan.estimated_monthly_premium ??
      plan.estimatedMonthlyPremium ??
      plan.ai_estimated_monthly_premium ??
      plan.aiEstimatedMonthlyPremium ??
      0
  );

  const estimatedYearlyPremium =
    Number(
      plan.estimated_yearly_premium ??
        plan.estimatedYearlyPremium ??
        plan.ai_estimated_yearly_premium ??
        plan.aiEstimatedYearlyPremium ??
        0
    ) ||
    (estimatedMonthlyPremium > 0
      ? estimatedMonthlyPremium * 12
      : 0);

  /* ================================
     BENEFITS
     ================================ */

  const benefits = plan.key_benefits
    ? plan.key_benefits
        .split(";")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  /* ================================
     OFFICIAL WEBSITE
     ================================ */

  const getOfficialWebsite = () => {
    if (companyName.includes("HDFC ERGO")) {
      return "https://www.hdfcergo.com/health-insurance/optima-secure";
    }

    if (companyName.includes("Care Health")) {
      return "https://www.careinsurance.com/product/care-supreme";
    }

    if (companyName.includes("Niva Bupa")) {
      return "https://www.nivabupa.com/family-health-insurance-plans/reassurev2-insurance.html";
    }

    if (companyName.includes("ICICI Lombard")) {
      return "https://www.icicilombard.com/health-insurance/elevate-health-policy";
    }

    if (companyName.includes("Aditya Birla")) {
      return "https://www.adityabirlacapital.com/healthinsurance/health-insurance-plans";
    }

    if (companyName.includes("Star Health")) {
      return "https://www.starhealth.in/health-insurance/family-health-optima/";
    }

    if (companyName.includes("ManipalCigna")) {
      return "https://www.manipalcigna.com/hospitalization-cover/prohealth-insurance";
    }

    if (companyName.includes("Royal Sundaram")) {
      return "https://www.royalsundaram.in/health-insurance/";
    }

    if (companyName.includes("ACKO")) {
      return "https://www.acko.com/health-insurance/";
    }

    return null;
  };

  const officialWebsite = getOfficialWebsite();

  return (
    <div className="plan-details-page">

      {/* =====================================
          HERO
          ===================================== */}

      <section className="plan-details-hero">

        <div className="plan-details-hero-label">
          INSURANCE PLAN DETAILS
        </div>

        <h1>
          {plan.plan_name}
        </h1>

        <p className="plan-details-hero-subtitle">
          {companyName}
        </p>

      </section>


      {/* =====================================
          AI MATCH SCORE
          ===================================== */}

      <section className="plan-details-match-section">

        <div className="plan-details-match-card">

          <div className="plan-details-match-left">

            <div className="plan-details-match-icon">
              🤖
            </div>

            <div>

              <span className="plan-details-match-label">
                FAMILYCARE AI MATCH
              </span>

              <h2>
                {aiMatchScore > 0
                  ? `${aiMatchScore}/100`
                  : "AI Score"}
              </h2>

              <p>
                {aiMatchLabel}
              </p>

            </div>

          </div>


          <div className="plan-details-match-right">

            <strong>
              Why this plan was recommended
            </strong>

            <p>
              This score represents how well this plan
              matches the family information provided to
              FamilyCare AI, including family size, ages,
              health factors, coverage needs and
              affordability.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================
          IMPORTANT NOTICE
          ===================================== */}

      <section className="plan-details-notice">

        <div className="plan-details-notice-icon">
          ℹ️
        </div>

        <div>

          <h3>
            Important information
          </h3>

          <p>
            This page provides a simplified comparison
            view of the selected insurance plan. Actual
            coverage, exclusions, waiting periods,
            eligibility, premium and benefits are governed
            by the insurer's current policy wording and
            terms.
          </p>

        </div>

      </section>


      {/* =====================================
          PLAN OVERVIEW
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>📋</span>

          <div>

            <h2>
              Plan Overview
            </h2>

            <p>
              Key information about this insurance plan.
            </p>

          </div>

        </div>


        <div className="plan-details-grid">

          <div className="plan-details-card">

            <span className="plan-details-label">
              Insurance Company
            </span>

            <strong>
              {companyName}
            </strong>

          </div>


          <div className="plan-details-card">

            <span className="plan-details-label">
              Plan Name
            </span>

            <strong>
              {plan.plan_name}
            </strong>

          </div>


          <div className="plan-details-card">

            <span className="plan-details-label">
              Coverage Amount
            </span>

            <strong>
              {formatMoney(plan.coverage_amount)}
            </strong>

          </div>


          <div className="plan-details-card">

            <span className="plan-details-label">
              Hospitalization
            </span>

            <strong>
              {plan.hospitalization
                ? "Covered"
                : "Not specified"}
            </strong>

          </div>


          <div className="plan-details-card">

            <span className="plan-details-label">
              Room Rent
            </span>

            <strong>
              {plan.room_rent_limit ||
                "As per policy terms"}
            </strong>

          </div>


          <div className="plan-details-card">

            <span className="plan-details-label">
              Maternity
            </span>

            <strong>
              {plan.maternity
                ? "Available"
                : "Check policy terms"}
            </strong>

          </div>


          <div className="plan-details-card">

            <span className="plan-details-label">
              Critical Illness
            </span>

            <strong>
              {plan.critical_illness
                ? "Available"
                : "Check policy terms"}
            </strong>

          </div>


          <div className="plan-details-card">

            <span className="plan-details-label">
              Eligibility
            </span>

            <strong>
              {plan.eligibility ||
                "Subject to insurer rules"}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================
          PREMIUM INFORMATION
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>💰</span>

          <div>

            <h2>
              Premium Information
            </h2>

            <p>
              Premium values shown by this application
              are AI-generated estimates unless an
              official insurer quote is obtained.
            </p>

          </div>

        </div>


        <div className="plan-details-premium-grid">

          <div className="plan-details-premium-card">

            <span>
              Estimated Monthly Premium
            </span>

            <strong>
              {estimatedMonthlyPremium > 0
                ? formatMoney(
                    estimatedMonthlyPremium
                  )
                : "AI Estimate unavailable"}
            </strong>

          </div>


          <div className="plan-details-premium-card">

            <span>
              Estimated Yearly Premium
            </span>

            <strong>
              {estimatedYearlyPremium > 0
                ? formatMoney(
                    estimatedYearlyPremium
                  )
                : "AI Estimate unavailable"}
            </strong>

          </div>

        </div>


        <div className="plan-details-small-info">

          <strong>
            Premium note
          </strong>

          <p>
            Your actual premium can change based on
            age, number of family members, city,
            coverage amount, medical history, selected
            add-ons and the insurer's current pricing.
          </p>

        </div>

      </section>


      {/* =====================================
          DESCRIPTION
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>📝</span>

          <div>

            <h2>
              Plan Description
            </h2>

            <p>
              A short description of the selected plan.
            </p>

          </div>

        </div>


        <div className="plan-details-information-card">

          <p>
            {plan.description ||
              "This insurance plan provides health protection subject to the insurer's current policy terms and conditions."}
          </p>

        </div>

      </section>


      {/* =====================================
          WAITING PERIOD
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>⏳</span>

          <div>

            <h2>
              Waiting Period
            </h2>

            <p>
              Important waiting-period information.
            </p>

          </div>

        </div>


        <div className="plan-details-information-card">

          <p>
            {plan.waiting_period ||
              "Please check the insurer's current policy wording for applicable waiting periods."}
          </p>

        </div>

      </section>


      {/* =====================================
          KEY BENEFITS
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>✅</span>

          <div>

            <h2>
              Key Benefits
            </h2>

            <p>
              Important benefits associated with this
              plan.
            </p>

          </div>

        </div>


        {benefits.length > 0 ? (

          <div className="plan-details-benefits-grid">

            {benefits.map(
              (benefit, index) => (

                <div
                  className="plan-details-benefit-card"
                  key={index}
                >

                  <span className="plan-details-benefit-check">
                    ✓
                  </span>

                  <span>
                    {benefit}
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="plan-details-information-card">

            <p>
              Benefits are subject to the insurer's
              current policy terms.
            </p>

          </div>

        )}

      </section>


      {/* =====================================
          MATERNITY
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>👶</span>

          <div>

            <h2>
              Maternity Information
            </h2>

            <p>
              Check the current policy before
              purchasing.
            </p>

          </div>

        </div>


        <div className="plan-details-information-card">

          <p>
            {plan.maternity_details ||
              "Maternity coverage should be verified against the current policy wording, applicable waiting period and selected cover."}
          </p>

        </div>

      </section>


      {/* =====================================
          CRITICAL ILLNESS
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>❤️</span>

          <div>

            <h2>
              Critical Illness Information
            </h2>

            <p>
              Check the current policy and optional
              covers.
            </p>

          </div>

        </div>


        <div className="plan-details-information-card">

          <p>
            {plan.critical_illness_details ||
              "Critical illness benefits should be verified from the insurer's current policy wording and applicable optional covers."}
          </p>

        </div>

      </section>


      {/* =====================================
          INSURANCE COMPANY
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>🏢</span>

          <div>

            <h2>
              Insurance Company
            </h2>

            <p>
              Information and official application
              options.
            </p>

          </div>

        </div>


        <div className="plan-details-company-card">

          <div className="plan-details-company-header">

            <div className="plan-details-company-logo">
              🏥
            </div>

            <div>

              <h3>
                {companyName}
              </h3>

              <p>
                Visit the insurer's official website
                to verify the latest policy information,
                premium and eligibility.
              </p>

            </div>

          </div>


          <div className="plan-details-company-actions">

            {officialWebsite && (

              <a
                href={officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="plan-details-primary-btn"
              >
                Visit Official Website ↗
              </a>

            )}


            <button
              className="plan-details-secondary-btn"
              onClick={onBack}
            >
              ← Back to Recommendations
            </button>

          </div>

        </div>

      </section>


      {/* =====================================
          HOW TO APPLY
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>🛒</span>

          <div>

            <h2>
              How to Apply
            </h2>

            <p>
              General steps for purchasing health
              insurance.
            </p>

          </div>

        </div>


        <div className="plan-details-steps">

          <div className="plan-details-step">

            <div className="plan-details-step-number">
              1
            </div>

            <div>

              <h3>
                Review the policy
              </h3>

              <p>
                Check coverage, exclusions, waiting
                periods and eligibility on the insurer's
                official website.
              </p>

            </div>

          </div>


          <div className="plan-details-step">

            <div className="plan-details-step-number">
              2
            </div>

            <div>

              <h3>
                Enter family information
              </h3>

              <p>
                Provide the required information about
                the people who will be covered by the
                policy.
              </p>

            </div>

          </div>


          <div className="plan-details-step">

            <div className="plan-details-step-number">
              3
            </div>

            <div>

              <h3>
                Complete the health declaration
              </h3>

              <p>
                Provide accurate information about
                existing health conditions and medical
                history.
              </p>

            </div>

          </div>


          <div className="plan-details-step">

            <div className="plan-details-step-number">
              4
            </div>

            <div>

              <h3>
                Review the official quote
              </h3>

              <p>
                Check the final premium and policy terms
                provided by the insurer before making a
                purchase.
              </p>

            </div>

          </div>


          <div className="plan-details-step">

            <div className="plan-details-step-number">
              5
            </div>

            <div>

              <h3>
                Purchase the policy
              </h3>

              <p>
                Complete the insurer's official
                application and payment process if the
                policy meets your requirements.
              </p>

            </div>

          </div>

        </div>


        <div className="plan-details-application-help">

          <p>
            <strong>
              Important:
            </strong>{" "}
            Always purchase through the insurer's
            official website or an authorized channel.
            Do not rely only on the AI recommendation
            when making an insurance decision.
          </p>

        </div>

      </section>


      {/* =====================================
          AGENT INFORMATION
          ===================================== */}

      <section className="plan-details-section">

        <div className="plan-details-section-heading">

          <span>👤</span>

          <div>

            <h2>
              Agent & Customer Support
            </h2>

            <p>
              Get help from the insurer before
              purchasing.
            </p>

          </div>

        </div>


        <div className="plan-details-agent-card">

          <h3>
            Need help choosing or applying?
          </h3>

          <p>
            Insurance companies may provide customer
            support, advisor assistance or agent-finder
            services. The exact number of agents
            available for a plan is not reliably
            published as a fixed public number, so this
            application does not invent an agent count.
          </p>


          <div className="plan-details-agent-note">

            Check the insurer's official website for
            current customer-care, advisor or
            agent-support options.

          </div>

        </div>

      </section>


      {/* =====================================
          WARNING
          ===================================== */}

      <section className="plan-details-warning">

        <div className="plan-details-warning-icon">
          ⚠️
        </div>

        <div>

          <h3>
            Before you purchase
          </h3>

          <ul>

            <li>
              Read the complete policy wording and
              exclusions.
            </li>

            <li>
              Verify waiting periods and pre-existing
              disease conditions.
            </li>

            <li>
              Confirm the final premium using the
              insurer's official quote.
            </li>

            <li>
              Check whether maternity and critical
              illness benefits apply to your selected
              policy.
            </li>

            <li>
              Make sure all medical information is
              declared accurately.
            </li>

          </ul>

        </div>

      </section>


      {/* =====================================
          BOTTOM ACTIONS
          ===================================== */}

      <div className="plan-details-bottom-actions">

        <button
          className="plan-details-secondary-btn"
          onClick={onBack}
        >
          ← Back to Recommendations
        </button>

      </div>

    </div>
  );
};

export default PlanDetails;