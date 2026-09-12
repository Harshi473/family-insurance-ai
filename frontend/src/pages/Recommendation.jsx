import React, { useEffect, useState } from "react";

function Recommendation({ familyData, onBack, onViewPlan }) {
  const family = familyData?.family || {};
  const members = familyData?.members || [];

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // FAMILY INFORMATION
  // ==================================================

  const memberCount = members.length;

  const ages = members
    .map((member) => Number(member.age))
    .filter((age) => !isNaN(age) && age > 0);

  const oldestAge =
    ages.length > 0 ? Math.max(...ages) : 30;

  const averageAge =
    ages.length > 0
      ? ages.reduce((sum, age) => sum + age, 0) / ages.length
      : 30;

  const hasSmoker = members.some((member) => {
    const smoker = String(member.smoker || "").toLowerCase();

    return (
      smoker === "yes" ||
      smoker === "true" ||
      smoker === "smoker"
    );
  });

  const healthConditionMembers = members.filter((member) => {
    const condition = String(
      member.healthConditions || ""
    )
      .trim()
      .toLowerCase();

    return (
      condition !== "" &&
      condition !== "none" &&
      condition !== "no" &&
      condition !== "no health condition"
    );
  });

  const hasHealthCondition =
    healthConditionMembers.length > 0;

  // ==================================================
  // HEALTH CONDITION TEXT
  // ==================================================

  const getHealthConditions = () => {
    const conditions = [];

    members.forEach((member) => {
      const condition = String(
        member.healthConditions || ""
      ).trim();

      if (
        condition &&
        condition.toLowerCase() !== "none" &&
        condition.toLowerCase() !== "no" &&
        condition.toLowerCase() !== "no health condition"
      ) {
        conditions.push(condition);
      }
    });

    return [...new Set(conditions)];
  };

  const healthConditions = getHealthConditions();

  // ==================================================
  // MATERNITY SIGNAL
  // ==================================================

  /*
   * A female member between 18 and 45 is treated as a
   * possible maternity consideration.
   *
   * This does NOT mean maternity is required.
   */

  const hasMaternityNeed = members.some((member) => {
    const gender = String(member.gender || "").toLowerCase();
    const age = Number(member.age);

    return (
      gender === "female" &&
      age >= 18 &&
      age <= 45
    );
  });

  // ==================================================
  // INCOME
  // ==================================================

  const annualIncome = (() => {
    const income = family.annualIncome;

    if (income === "above_10_lakh") {
      return 1000000;
    }

    if (income === "above_5_lakh") {
      return 500000;
    }

    return Number(income || 0);
  })();

  // ==================================================
  // FETCH PLANS
  // ==================================================

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
  "https://family-insurance-ai.onrender.com/api/plans"
);

        if (!response.ok) {
          throw new Error(
            "Unable to connect to backend."
          );
        }

        const data = await response.json();

        // Support both API response formats:
        // { success: true, plans: [...] }
        // or a direct plans array [...]
        const availablePlans = Array.isArray(data)
          ? data
          : Array.isArray(data.plans)
          ? data.plans
          : [];

        if (!Array.isArray(data) && data.success === false) {
          throw new Error(
            data.message || "Unable to load insurance plans."
          );
        }

        if (availablePlans.length === 0) {
          throw new Error(
            "No insurance plans are available right now."
          );
        }

        setPlans(availablePlans);
      } catch (err) {
        console.error(
          "Recommendation error:",
          err
        );

        setError(
          "Unable to load insurance plans. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // ==================================================
  // HELPERS
  // ==================================================

  const getPlanText = (plan) => {
    return `
      ${plan.plan_name || ""}
      ${plan.insurer_name || ""}
      ${plan.description || ""}
      ${plan.key_benefits || ""}
      ${plan.maternity_details || ""}
      ${plan.critical_illness_details || ""}
      ${plan.waiting_period || ""}
      ${plan.eligibility || ""}
      ${plan.room_rent_limit || ""}
    `.toLowerCase();
  };

  const containsAny = (text, words) => {
    return words.some((word) =>
      text.includes(word)
    );
  };

  const getBenefitCount = (plan) => {
    if (!plan.key_benefits) {
      return 0;
    }

    return plan.key_benefits
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean).length;
  };

  // ==================================================
  // PLAN CATEGORY
  // ==================================================

  const getPlanCategory = (plan) => {
    const name = String(
      plan.plan_name || ""
    ).toLowerCase();

    if (name.includes("my:optima secure")) {
      return "balanced";
    }

    if (name.includes("care supreme")) {
      return "family";
    }

    if (name.includes("reassure 2.0")) {
      return "restoration";
    }

    if (name.includes("elevate")) {
      return "customizable";
    }

    if (name.includes("activ one max")) {
      return "enhanced";
    }

    if (name.includes("family health optima")) {
      return "family";
    }

    if (name.includes("prohealth prime")) {
      return "balanced";
    }

    if (name.includes("lifeline supreme")) {
      return "balanced";
    }

    if (name.includes("platinum lite")) {
      return "digital";
    }

    if (name.includes("activ one nxt")) {
      return "restoration";
    }

    return "general";
  };

  // ==================================================
  // PLAN BASE PREMIUM
  // ==================================================

  const getPlanBasePremium = (plan) => {
    const name = String(
      plan.plan_name || ""
    ).toLowerCase();

    if (name.includes("my:optima secure")) {
      return 1750;
    }

    if (name.includes("care supreme")) {
      return 2250;
    }

    if (name.includes("reassure 2.0")) {
      return 2900;
    }

    if (name.includes("elevate")) {
      return 3150;
    }

    if (name.includes("activ one max")) {
      return 3050;
    }

    if (name.includes("family health optima")) {
      return 1850;
    }

    if (name.includes("prohealth prime")) {
      return 2750;
    }

    if (name.includes("lifeline supreme")) {
      return 2600;
    }

    if (name.includes("platinum lite")) {
      return 2450;
    }

    if (name.includes("activ one nxt")) {
      return 2700;
    }

    const databasePremium = Number(
      plan.base_monthly_premium || 0
    );

    if (databasePremium > 0) {
      return databasePremium;
    }

    const coverage = Number(
      plan.coverage_amount || 0
    );

    if (coverage >= 2000000) {
      return 4500;
    }

    if (coverage >= 1000000) {
      return 3000;
    }

    if (coverage >= 700000) {
      return 2300;
    }

    return 1800;
  };

  // ==================================================
  // ESTIMATED PREMIUM
  // ==================================================

  const calculateEstimatedPremium = (plan) => {
    let premium =
      getPlanBasePremium(plan);

    // FAMILY SIZE
    if (memberCount >= 5) {
      premium *= 1.2;
    } else if (memberCount === 4) {
      premium *= 1.15;
    } else if (memberCount === 3) {
      premium *= 1.08;
    } else if (memberCount === 2) {
      premium *= 1.03;
    }

    // AGE
    if (oldestAge >= 65) {
      premium *= 1.28;
    } else if (oldestAge >= 60) {
      premium *= 1.2;
    } else if (oldestAge >= 50) {
      premium *= 1.14;
    } else if (oldestAge >= 45) {
      premium *= 1.1;
    } else if (oldestAge >= 30) {
      premium *= 1.04;
    }

    // SMOKING
    if (hasSmoker) {
      premium *= 1.12;
    }

    // HEALTH
    if (hasHealthCondition) {
      premium *= 1.12;
    }

    // MATERNITY
    if (hasMaternityNeed) {
      premium *= 1.05;
    }

    // INCOME
    if (
      annualIncome > 0 &&
      annualIncome <= 300000
    ) {
      premium *= 0.96;
    } else if (
      annualIncome > 500000 &&
      annualIncome <= 1000000
    ) {
      premium *= 1.03;
    } else if (
      annualIncome > 1000000
    ) {
      premium *= 1.06;
    }

    // CATEGORY
    const category =
      getPlanCategory(plan);

    if (
      category === "enhanced" &&
      (hasHealthCondition || hasSmoker)
    ) {
      premium *= 1.04;
    }

    if (
      category === "restoration" &&
      (hasHealthCondition ||
        oldestAge >= 50)
    ) {
      premium *= 1.03;
    }

    return Math.max(
      500,
      Math.round(premium / 10) * 10
    );
  };

  // ==================================================
  // PREFERRED COVERAGE
  // ==================================================

  const getPreferredCoverage = () => {
    if (
      memberCount >= 5 ||
      oldestAge >= 60 ||
      hasHealthCondition ||
      hasSmoker
    ) {
      return 1000000;
    }

    if (
      memberCount >= 3 ||
      oldestAge >= 45
    ) {
      return 1000000;
    }

    if (annualIncome > 500000) {
      return 1000000;
    }

    return 700000;
  };

  // ==================================================
  // AI SCORE
  // ==================================================

  const calculateScore = (plan) => {
    let score = 0;

    const coverage = Number(
      plan.coverage_amount || 0
    );

    const planText =
      getPlanText(plan);

    const category =
      getPlanCategory(plan);

    const benefitCount =
      getBenefitCount(plan);

    const estimatedPremium =
      calculateEstimatedPremium(plan);

    // --------------------------------------------------
    // 1. FAMILY SIZE
    // --------------------------------------------------

    if (memberCount === 1) {
      if (coverage === 500000) {
        score += 22;
      } else if (coverage === 700000) {
        score += 19;
      } else if (coverage === 1000000) {
        score += 12;
      } else {
        score += 5;
      }
    } else if (memberCount === 2) {
      if (coverage === 500000) {
        score += 18;
      } else if (coverage === 700000) {
        score += 24;
      } else if (coverage === 1000000) {
        score += 18;
      } else {
        score += 8;
      }
    } else if (memberCount === 3) {
      if (coverage === 700000) {
        score += 26;
      } else if (coverage === 1000000) {
        score += 25;
      } else if (coverage === 500000) {
        score += 15;
      } else {
        score += 8;
      }
    } else if (memberCount === 4) {
      if (coverage >= 1000000) {
        score += 30;
      } else if (coverage === 700000) {
        score += 20;
      } else {
        score += 7;
      }
    } else {
      if (coverage >= 1000000) {
        score += 34;
      } else if (coverage === 700000) {
        score += 17;
      } else {
        score += 4;
      }
    }

    // --------------------------------------------------
    // 2. OLDEST AGE
    // --------------------------------------------------

    if (oldestAge >= 65) {
      if (coverage >= 1000000) {
        score += 32;
      } else if (coverage === 700000) {
        score += 14;
      } else {
        score += 2;
      }
    } else if (oldestAge >= 60) {
      if (coverage >= 1000000) {
        score += 29;
      } else if (coverage === 700000) {
        score += 16;
      } else {
        score += 4;
      }
    } else if (oldestAge >= 50) {
      if (coverage >= 1000000) {
        score += 25;
      } else if (coverage === 700000) {
        score += 18;
      } else {
        score += 7;
      }
    } else if (oldestAge >= 40) {
      if (coverage >= 1000000) {
        score += 21;
      } else if (coverage === 700000) {
        score += 19;
      } else {
        score += 9;
      }
    } else if (oldestAge >= 30) {
      if (coverage === 700000) {
        score += 18;
      } else if (coverage === 500000) {
        score += 16;
      } else {
        score += 12;
      }
    } else {
      if (coverage <= 700000) {
        score += 21;
      } else {
        score += 12;
      }
    }

    // --------------------------------------------------
    // 3. AVERAGE AGE
    // --------------------------------------------------

    if (averageAge < 30) {
      if (coverage <= 700000) {
        score += 10;
      } else {
        score += 4;
      }
    } else if (averageAge < 40) {
      if (coverage >= 700000) {
        score += 8;
      }
    } else if (averageAge >= 45) {
      if (coverage >= 1000000) {
        score += 13;
      } else if (coverage >= 700000) {
        score += 7;
      }
    }

    // --------------------------------------------------
    // 4. HEALTH CONDITIONS
    // --------------------------------------------------

    if (hasHealthCondition) {
      if (coverage >= 1000000) {
        score += 18;
      } else if (coverage >= 700000) {
        score += 9;
      }

      if (
        containsAny(planText, [
          "critical illness",
          "critical",
          "illness"
        ])
      ) {
        score += 12;
      }

      if (
        containsAny(planText, [
          "restore",
          "recharge",
          "reload",
          "refill",
          "booster"
        ])
      ) {
        score += 12;
      }

      if (
        containsAny(planText, [
          "hospital",
          "hospitalization"
        ])
      ) {
        score += 5;
      }
    } else {
      if (coverage <= 700000) {
        score += 8;
      }

      if (
        containsAny(planText, [
          "wellness",
          "preventive",
          "health check"
        ])
      ) {
        score += 8;
      }
    }

    // --------------------------------------------------
    // 5. SMOKING
    // --------------------------------------------------

    if (hasSmoker) {
      if (coverage >= 1000000) {
        score += 16;
      } else if (coverage >= 700000) {
        score += 8;
      }

      if (
        containsAny(planText, [
          "critical",
          "illness"
        ])
      ) {
        score += 9;
      }

      if (
        containsAny(planText, [
          "restore",
          "recharge",
          "reload",
          "refill",
          "booster"
        ])
      ) {
        score += 9;
      }
    } else {
      score += 5;
    }

    // --------------------------------------------------
    // 6. MATERNITY
    // --------------------------------------------------

    if (hasMaternityNeed) {
      const maternityText = `
        ${plan.maternity_details || ""}
        ${plan.key_benefits || ""}
        ${plan.description || ""}
      `.toLowerCase();

      if (
        containsAny(maternityText, [
          "maternity",
          "pregnancy",
          "delivery",
          "newborn"
        ])
      ) {
        score += 30;
      } else if (
        !maternityText.includes("excluded") &&
        !maternityText.includes("not covered")
      ) {
        score += 4;
      }
    }

    // --------------------------------------------------
    // 7. INCOME
    // --------------------------------------------------

    if (
      annualIncome > 0 &&
      annualIncome <= 200000
    ) {
      if (coverage <= 500000) {
        score += 25;
      } else if (coverage === 700000) {
        score += 21;
      } else if (coverage === 1000000) {
        score += 8;
      } else {
        score += 2;
      }
    } else if (
      annualIncome > 200000 &&
      annualIncome <= 300000
    ) {
      if (coverage <= 700000) {
        score += 24;
      } else if (coverage === 1000000) {
        score += 12;
      } else {
        score += 4;
      }
    } else if (
      annualIncome > 300000 &&
      annualIncome <= 500000
    ) {
      if (coverage === 700000) {
        score += 21;
      } else if (coverage === 1000000) {
        score += 18;
      } else if (coverage === 500000) {
        score += 12;
      }
    } else if (
      annualIncome > 500000 &&
      annualIncome <= 1000000
    ) {
      if (coverage >= 1000000) {
        score += 23;
      } else if (coverage === 700000) {
        score += 15;
      } else {
        score += 7;
      }
    } else if (annualIncome > 1000000) {
      if (coverage >= 1000000) {
        score += 25;
      } else if (coverage === 700000) {
        score += 15;
      } else {
        score += 8;
      }
    }

    // --------------------------------------------------
    // 8. HOSPITALIZATION
    // --------------------------------------------------

    if (plan.hospitalization) {
      score += 8;
    }

    // --------------------------------------------------
    // 9. BENEFITS
    // --------------------------------------------------

    if (benefitCount >= 6) {
      score += 12;
    } else if (benefitCount >= 5) {
      score += 10;
    } else if (benefitCount >= 3) {
      score += 7;
    } else if (benefitCount >= 1) {
      score += 4;
    }

    // --------------------------------------------------
    // 10. RESTORATION
    // --------------------------------------------------

    if (
      containsAny(planText, [
        "restore",
        "recharge",
        "reload",
        "refill",
        "booster"
      ])
    ) {
      score += 8;
    }

    // --------------------------------------------------
    // 11. ROOM RENT
    // --------------------------------------------------

    const roomRent = String(
      plan.room_rent_limit || ""
    ).toLowerCase();

    if (
      roomRent.includes("no room rent") ||
      roomRent.includes("no capping") ||
      roomRent.includes("any room")
    ) {
      score += 9;
    } else if (
      roomRent.includes("as per policy")
    ) {
      score += 3;
    }

    // --------------------------------------------------
    // 12. WAITING PERIOD
    // --------------------------------------------------

    const waitingPeriod = String(
      plan.waiting_period || ""
    ).toLowerCase();

    if (
      waitingPeriod.includes("0 day") ||
      waitingPeriod.includes("no waiting")
    ) {
      score += 8;
    } else if (
      waitingPeriod.includes("30 day") ||
      waitingPeriod.includes("30 days")
    ) {
      score += 5;
    } else if (
      waitingPeriod.includes("2 year") ||
      waitingPeriod.includes("3 year")
    ) {
      score += 1;
    }

    // --------------------------------------------------
    // 13. FAMILY FEATURES
    // --------------------------------------------------

    if (memberCount >= 3) {
      if (
        containsAny(planText, [
          "family",
          "floater",
          "dependents"
        ])
      ) {
        score += 10;
      }
    }

    // --------------------------------------------------
    // 14. PREFERRED COVERAGE
    // --------------------------------------------------

    const preferredCoverage =
      getPreferredCoverage();

    if (coverage === preferredCoverage) {
      score += 15;
    } else if (
      Math.abs(
        coverage - preferredCoverage
      ) <= 300000
    ) {
      score += 7;
    }

    // --------------------------------------------------
    // 15. CATEGORY
    // --------------------------------------------------

    if (category === "restoration") {
      if (
        hasHealthCondition ||
        hasSmoker ||
        oldestAge >= 50
      ) {
        score += 16;
      } else {
        score += 5;
      }
    }

    if (category === "family") {
      if (memberCount >= 3) {
        score += 14;
      } else if (memberCount === 2) {
        score += 8;
      } else {
        score += 3;
      }
    }

    if (category === "enhanced") {
      if (
        hasHealthCondition ||
        hasSmoker ||
        oldestAge >= 45
      ) {
        score += 14;
      } else {
        score += 6;
      }
    }

    if (category === "customizable") {
      if (
        annualIncome >= 500000 ||
        memberCount >= 3
      ) {
        score += 11;
      } else {
        score += 5;
      }
    }

    if (category === "digital") {
      if (
        memberCount <= 3 &&
        oldestAge < 50
      ) {
        score += 11;
      } else {
        score += 4;
      }
    }

    if (category === "balanced") {
      if (
        memberCount <= 3 &&
        oldestAge < 50
      ) {
        score += 10;
      } else {
        score += 6;
      }
    }

    // --------------------------------------------------
    // 16. PLAN-SPECIFIC MATCHING
    // --------------------------------------------------

    if (
      hasHealthCondition &&
      containsAny(planText, [
        "super reload",
        "reassure forever",
        "booster",
        "restore",
        "recharge",
        "reload"
      ])
    ) {
      score += 10;
    }

    if (
      hasSmoker &&
      containsAny(planText, [
        "critical",
        "illness",
        "restore",
        "recharge",
        "reload"
      ])
    ) {
      score += 8;
    }

    if (
      hasMaternityNeed &&
      containsAny(planText, [
        "maternity",
        "pregnancy",
        "delivery",
        "newborn"
      ])
    ) {
      score += 12;
    }

    if (
      memberCount >= 4 &&
      containsAny(planText, [
        "family",
        "floater"
      ])
    ) {
      score += 8;
    }

    if (
      oldestAge >= 60 &&
      containsAny(planText, [
        "restore",
        "reassure",
        "reload",
        "booster"
      ])
    ) {
      score += 9;
    }

    // --------------------------------------------------
    // 17. AFFORDABILITY
    // --------------------------------------------------

    if (
      annualIncome > 0 &&
      annualIncome <= 300000
    ) {
      if (estimatedPremium <= 2200) {
        score += 7;
      } else if (estimatedPremium <= 2800) {
        score += 4;
      }
    } else if (
      annualIncome > 300000 &&
      annualIncome <= 500000
    ) {
      if (estimatedPremium <= 2800) {
        score += 5;
      }
    } else if (
      annualIncome > 500000
    ) {
      if (estimatedPremium >= 3000) {
        score += 3;
      }
    }

    return score;
  };

  // ==================================================
  // CONVERT RAW SCORE TO 100
  // ==================================================

  const getMatchScore = (
    plan,
    allRankedPlans
  ) => {
    if (!allRankedPlans.length) {
      return 0;
    }

    const scores =
      allRankedPlans.map(
        (item) => item.score
      );

    const highestScore =
      Math.max(...scores);

    const lowestScore =
      Math.min(...scores);

    const rawScore =
      calculateScore(plan);

    /*
     * Normalize the score into a useful 70-98 range.
     * This is a project suitability score, not an
     * official insurer score.
     */

    if (
      highestScore === lowestScore
    ) {
      return 85;
    }

    const normalized =
      70 +
      ((rawScore - lowestScore) /
        (highestScore - lowestScore)) *
        28;

    return Math.round(
      Math.min(98, Math.max(70, normalized))
    );
  };

  // ==================================================
  // MATCH LABEL
  // ==================================================

  const getMatchLabel = (score) => {
    if (score >= 93) {
      return "Excellent Match";
    }

    if (score >= 87) {
      return "Strong Match";
    }

    if (score >= 80) {
      return "Good Match";
    }

    return "Suitable Option";
  };

  // ==================================================
  // PLAN-SPECIFIC REASON
  // ==================================================

  const getPlanSpecificReason = (plan) => {
    const category =
      getPlanCategory(plan);

    const planName =
      String(plan.plan_name || "");

    const planText =
      getPlanText(plan);

    if (
      hasHealthCondition &&
      containsAny(planText, [
        "restore",
        "recharge",
        "reload",
        "refill",
        "booster"
      ])
    ) {
      return `${planName} scored higher because its restoration or recharge features can provide additional protection when your family has declared health conditions.`;
    }

    if (
      hasSmoker &&
      containsAny(planText, [
        "critical",
        "illness"
      ])
    ) {
      return `${planName} scored higher because its available illness-related protection matched the additional risk factor identified in your family profile.`;
    }

    if (
      hasMaternityNeed &&
      containsAny(planText, [
        "maternity",
        "pregnancy",
        "delivery",
        "newborn"
      ])
    ) {
      return `${planName} scored higher because maternity-related information in the available plan data matched a possible maternity requirement in your family profile.`;
    }

    if (
      category === "family" &&
      memberCount >= 3
    ) {
      return `${planName} scored higher because its family-oriented features are relevant to your ${memberCount}-member family.`;
    }

    if (
      category === "restoration" &&
      oldestAge >= 50
    ) {
      return `${planName} scored higher because restoration-related features were given more importance for your family's older age profile.`;
    }

    if (
      category === "enhanced" &&
      (hasHealthCondition ||
        hasSmoker ||
        oldestAge >= 45)
    ) {
      return `${planName} scored higher because its enhanced protection profile matches the higher-risk factors identified in your family details.`;
    }

    if (
      category === "customizable" &&
      (annualIncome >= 500000 ||
        memberCount >= 3)
    ) {
      return `${planName} scored higher because its customizable coverage profile can be considered for your family size and selected income range.`;
    }

    if (
      category === "digital" &&
      memberCount <= 3 &&
      oldestAge < 50
    ) {
      return `${planName} scored higher because its overall profile is a reasonable match for a smaller and relatively younger family.`;
    }

    if (category === "balanced") {
      return `${planName} scored higher because its overall coverage profile provides a balanced option for your family circumstances.`;
    }

    return `${planName} matched several of the family and plan factors evaluated by FamilyCare AI.`;
  };

  // ==================================================
  // PERSONALIZED REASONS
  // ==================================================

  const getReasons = (plan) => {
    const reasons = [];

    const coverage = Number(
      plan.coverage_amount || 0
    );

    const planText =
      getPlanText(plan);

    // --------------------------------------------------
    // FAMILY SIZE
    // --------------------------------------------------

    if (memberCount >= 5) {
      if (coverage >= 1000000) {
        reasons.push(
          `₹10 lakh or higher coverage was prioritized because your family has ${memberCount} members.`
        );
      } else {
        reasons.push(
          `Your family has ${memberCount} members, so FamilyCare AI considered family size when evaluating the coverage level.`
        );
      }
    } else if (memberCount >= 3) {
      if (coverage >= 1000000) {
        reasons.push(
          `₹10 lakh coverage was given stronger consideration for your ${memberCount}-member family.`
        );
      } else if (coverage >= 700000) {
        reasons.push(
          `The ₹7 lakh coverage level provides a balanced option for your ${memberCount}-member family.`
        );
      } else {
        reasons.push(
          `FamilyCare AI considered your ${memberCount}-member family when evaluating the coverage amount.`
        );
      }
    } else {
      reasons.push(
        `The coverage level was compared with your ${memberCount}-member family profile.`
      );
    }

    // --------------------------------------------------
    // AGE
    // --------------------------------------------------

    if (oldestAge >= 60) {
      if (coverage >= 1000000) {
        reasons.push(
          `Your family's oldest member is ${oldestAge}, so stronger coverage received additional weight.`
        );
      } else {
        reasons.push(
          `Your family's oldest member is ${oldestAge}, so age was considered carefully when ranking this plan.`
        );
      }
    } else if (oldestAge >= 45) {
      reasons.push(
        `Your oldest family member is ${oldestAge}, which increased the importance of stronger health protection.`
      );
    } else if (oldestAge < 30) {
      reasons.push(
        `Your relatively young family profile allows more focus on balancing coverage and affordability.`
      );
    } else {
      reasons.push(
        `The family's age profile was included in the suitability calculation.`
      );
    }

    // --------------------------------------------------
    // HEALTH CONDITIONS
    // --------------------------------------------------

    if (hasHealthCondition) {
      if (healthConditions.length > 0) {
        reasons.push(
          `Declared health conditions (${healthConditions.join(
            ", "
          )}) were considered in the recommendation.`
        );
      } else {
        reasons.push(
          "Declared health conditions were considered in the recommendation."
        );
      }

      if (
        containsAny(planText, [
          "restore",
          "recharge",
          "reload",
          "refill",
          "booster"
        ])
      ) {
        reasons.push(
          "Restoration or recharge features increased suitability because they can provide additional protection after eligible coverage is used."
        );
      } else if (
        containsAny(planText, [
          "critical",
          "illness"
        ])
      ) {
        reasons.push(
          "The available illness-related protection information contributed to the plan's suitability."
        );
      }
    }

    // --------------------------------------------------
    // SMOKING
    // --------------------------------------------------

    if (hasSmoker) {
      reasons.push(
        "A smoker in the family increased the importance of stronger coverage and risk-related protection."
      );
    }

    // --------------------------------------------------
    // MATERNITY
    // --------------------------------------------------

    if (
      hasMaternityNeed &&
      containsAny(planText, [
        "maternity",
        "pregnancy",
        "delivery",
        "newborn"
      ])
    ) {
      reasons.push(
        "Maternity information was considered because your family includes a female member in the age range used as a maternity consideration."
      );
    }

    // --------------------------------------------------
    // INCOME
    // --------------------------------------------------

    if (
      annualIncome > 0 &&
      annualIncome <= 300000
    ) {
      if (coverage <= 700000) {
        reasons.push(
          "The coverage and estimated premium were evaluated with affordability in mind for your selected income range."
        );
      } else {
        reasons.push(
          "Your income range was considered while balancing stronger coverage against the estimated premium."
        );
      }
    } else if (
      annualIncome > 500000 &&
      coverage >= 1000000
    ) {
      reasons.push(
        "Your selected income range supports considering higher coverage while maintaining affordability."
      );
    }

    // --------------------------------------------------
    // PLAN-SPECIFIC
    // --------------------------------------------------

    reasons.push(
      getPlanSpecificReason(plan)
    );

    // --------------------------------------------------
    // ROOM RENT
    // --------------------------------------------------

    const roomRent =
      String(
        plan.room_rent_limit || ""
      ).toLowerCase();

    if (
      roomRent.includes("no room rent") ||
      roomRent.includes("no capping") ||
      roomRent.includes("any room")
    ) {
      reasons.push(
        "The available plan information indicates favorable room-rent terms."
      );
    }

    // --------------------------------------------------
    // HOSPITALIZATION
    // --------------------------------------------------

    if (plan.hospitalization) {
      reasons.push(
        "Hospitalization coverage is included in the available plan information."
      );
    }

    return reasons.slice(0, 3);
  };

  // ==================================================
  // RANK ALL PLANS
  // ==================================================

  const rankedPlans = plans
    .map((plan) => ({
      ...plan,

      score:
        calculateScore(plan),

      estimatedMonthlyPremium:
        calculateEstimatedPremium(plan),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const premiumDifference =
        Number(
          a.estimatedMonthlyPremium || 0
        ) -
        Number(
          b.estimatedMonthlyPremium || 0
        );

      if (premiumDifference !== 0) {
        return premiumDifference;
      }

      return (
        Number(b.coverage_amount || 0) -
        Number(a.coverage_amount || 0)
      );
    });

  const recommendedPlans =
    rankedPlans.slice(0, 4);

  // ==================================================
  // MONEY FORMAT
  // ==================================================

  const formatMoney = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  // ==================================================
  // BADGES
  // ==================================================

  const getBadge = (
    index,
    matchScore
  ) => {
    if (index === 0) {
      return "⭐ Most Suitable";
    }

    if (matchScore >= 87) {
      return "Strong Match";
    }

    if (matchScore >= 80) {
      return "Good Match";
    }

    return "Suitable Option";
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="recommendation-page">

        <header className="recommendation-navbar">

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

        </header>

        <main className="recommendation-container">

          <section className="plans-heading">

            <h2>
              Loading insurance plans...
            </h2>

            <p>
              FamilyCare AI is retrieving the available plans.
            </p>

          </section>

        </main>

      </div>
    );
  }

  // ==================================================
  // MAIN PAGE
  // ==================================================

  return (
    <div className="recommendation-page">

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <header className="recommendation-navbar">

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

        <button
          type="button"
          className="recommendation-back-btn"
          onClick={onBack}
        >
          ← Back to Family Details
        </button>

      </header>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="recommendation-container">

        {/* ========================================
            HERO
        ======================================== */}

        <section className="recommendation-hero">

          <div className="ai-circle">
            🤖
          </div>

          <div>

            <p className="section-label">
              FAMILYCARE AI ASSISTANT
            </p>

            <h1>
              Your Family Insurance Recommendations
            </h1>

            <p className="recommendation-subtitle">
              FamilyCare AI analyzed your family details,
              compared the available market plans and ranked
              the four plans that may be most suitable for you.
            </p>

            <div className="family-summary">

              <span>
                👨‍👩‍👧‍👦 {memberCount} Family Member
                {memberCount !== 1 ? "s" : ""}
              </span>

              <span>
                🎂 Oldest Age: {oldestAge}
              </span>

              {hasSmoker && (
                <span>
                  🚬 Smoker in Family
                </span>
              )}

              {hasHealthCondition && (
                <span>
                  🏥 Health Condition Declared
                </span>
              )}

              {hasMaternityNeed && (
                <span>
                  🤰 Maternity Consideration
                </span>
              )}

            </div>

          </div>

        </section>

        {/* ========================================
            NOTICE
        ======================================== */}

        <section className="recommendation-notice">

          <div className="notice-icon">
            !
          </div>

          <div>

            <strong>
              Important: AI recommendations are estimates
            </strong>

            <p>
              FamilyCare AI ranks plans using family size,
              ages, income, health information, smoking status,
              possible maternity needs and plan-specific
              features. Estimated premiums are project estimates
              and are not official insurer quotations. Final
              premium, eligibility, exclusions and benefits
              depend on the insurer and policy terms.
            </p>

          </div>

        </section>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <section className="recommendation-notice">

            <div className="notice-icon">
              !
            </div>

            <div>

              <strong>
                Unable to load plans
              </strong>

              <p>
                {error}
              </p>

            </div>

          </section>
        )}

        {/* ========================================
            RECOMMENDED PLANS
        ======================================== */}

        {!error &&
          recommendedPlans.length > 0 && (
            <>

              <section className="plans-heading">

                <p className="section-label">
                  TOP 4 FROM {plans.length} MARKET PLANS
                </p>

                <h2>
                  Plans That May Suit Your Family
                </h2>

                <p>
                  FamilyCare AI compared all {plans.length}
                  plans and selected these four based on
                  family circumstances, affordability and
                  available plan features.
                </p>

              </section>

              <section className="recommendation-plans">

                {recommendedPlans.map(
                  (plan, index) => {

                    const yearlyPremium =
                      plan.estimatedMonthlyPremium *
                      12;

                    const matchScore =
                      getMatchScore(
                        plan,
                        rankedPlans
                      );

                    const matchLabel =
                      getMatchLabel(
                        matchScore
                      );

                    const reasons =
                      getReasons(plan);

                    return (
                      <article
                        className={`recommendation-card ${
                          index === 0
                            ? "top-recommendation"
                            : ""
                        }`}
                        key={plan.id}
                      >

                        {/* CARD TOP */}

                        <div className="recommendation-card-top">

                          <span className="rank-number">
                            #{index + 1} Recommendation
                          </span>

                          <span className="plan-badge">
                            {getBadge(
                              index,
                              matchScore
                            )}
                          </span>

                        </div>

                        {/* AI MATCH SCORE */}

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "16px",
                            margin: "18px 0",
                            padding: "16px 18px",
                            borderRadius: "14px",
                            background:
                              "linear-gradient(135deg, #f0fdf4, #eff6ff)",
                            border:
                              "1px solid #dbeafe"
                          }}
                        >

                          <div>

                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: "700",
                                letterSpacing: "0.08em",
                                color: "#64748b",
                                marginBottom: "5px"
                              }}
                            >
                              FAMILYCARE AI MATCH
                            </div>

                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#334155"
                              }}
                            >
                              {matchLabel}
                            </div>

                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: "3px"
                            }}
                          >

                            <strong
                              style={{
                                fontSize: "34px",
                                lineHeight: "1",
                                color: "#0f766e"
                              }}
                            >
                              {matchScore}
                            </strong>

                            <span
                              style={{
                                fontSize: "14px",
                                color: "#64748b",
                                fontWeight: "600"
                              }}
                            >
                              /100
                            </span>

                          </div>

                        </div>

                        {/* PLAN NAME */}

                        <h2 className="recommendation-plan-name">
                          {plan.plan_name}
                        </h2>

                        <p className="insurer-name">
                          {plan.insurer_name}
                        </p>

                        {/* COVERAGE */}

                        <div className="coverage-box">

                          <span>
                            SUM INSURED
                          </span>

                          <strong>
                            {formatMoney(
                              plan.coverage_amount
                            )}
                          </strong>

                        </div>

                        {/* PREMIUM */}

                        <div className="premium-grid">

                          <div className="premium-box">

                            <span>
                              AI ESTIMATED MONTHLY
                            </span>

                            <strong>
                              {formatMoney(
                                plan.estimatedMonthlyPremium
                              )}
                            </strong>

                          </div>

                          <div className="premium-box">

                            <span>
                              AI ESTIMATED YEARLY
                            </span>

                            <strong>
                              {formatMoney(
                                yearlyPremium
                              )}
                            </strong>

                          </div>

                        </div>

                        {/* PLAN DETAILS */}

                        <div className="plan-details">

                          <div>

                            <span>
                              Hospitalization
                            </span>

                            <strong>
                              {plan.hospitalization
                                ? "Available"
                                : "Check policy"}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Maternity
                            </span>

                            <strong>
                              {plan.maternity_details
                                ? "See policy"
                                : "Check policy"}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Critical Illness
                            </span>

                            <strong>
                              {plan.critical_illness_details
                                ? "See policy"
                                : "Check policy"}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Room Rent
                            </span>

                            <strong>
                              {plan.room_rent_limit ||
                                "Check policy"}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Waiting Period
                            </span>

                            <strong>
                              {plan.waiting_period ||
                                "Check policy"}
                            </strong>

                          </div>

                          <div>

                            <span>
                              Eligibility
                            </span>

                            <strong>
                              {plan.eligibility ||
                                "Check policy"}
                            </strong>

                          </div>

                        </div>

                        {/* ABOUT */}

                        <div className="suitable-box">

                          <h3>
                            About this plan
                          </h3>

                          <p>
                            {plan.description}
                          </p>

                        </div>

                        {/* WHY RECOMMENDED */}

                        <div className="why-recommended">

                          <h3>
                            Why FamilyCare AI selected it
                          </h3>

                          <ul>

                            {reasons.map(
                              (
                                reason,
                                reasonIndex
                              ) => (
                                <li
                                  key={
                                    reasonIndex
                                  }
                                >

                                  <span>
                                    ✓
                                  </span>

                                  <p>
                                    {reason}
                                  </p>

                                </li>
                              )
                            )}

                          </ul>

                        </div>

                        {/* KEY BENEFITS */}

                        <div className="why-recommended">

                          <h3>
                            Key benefits
                          </h3>

                          <ul>

                            {plan.key_benefits
                              ?.split(";")
                              .map(
                                (
                                  benefit,
                                  benefitIndex
                                ) => {

                                  const cleanBenefit =
                                    benefit.trim();

                                  if (
                                    !cleanBenefit
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <li
                                      key={
                                        benefitIndex
                                      }
                                    >

                                      <span>
                                        ✓
                                      </span>

                                      <p>
                                        {cleanBenefit}
                                      </p>

                                    </li>
                                  );
                                }
                              )}

                          </ul>

                        </div>

                        {/* BEFORE CHOOSING */}

                        <div className="things-to-check">

                          <h3>
                            Before choosing this plan
                          </h3>

                          <p>
                            Review the insurer's official
                            policy wording, final premium,
                            eligibility, waiting periods,
                            exclusions, claim conditions
                            and applicable benefits.
                          </p>

                        </div>

                        {/* VIEW DETAILS */}

                        <button
                          type="button"
                          className="view-plan-btn"
                          onClick={() =>
                            onViewPlan({
                              ...plan,

                              estimated_monthly_premium:
                                plan.estimatedMonthlyPremium,

                              estimated_yearly_premium:
                                yearlyPremium,

                              ai_match_score:
                                matchScore,

                              ai_match_label:
                                matchLabel,
                            })
                          }
                        >
                          View Plan Details
                          <span>→</span>
                        </button>

                      </article>
                    );
                  }
                )}

              </section>

            </>
          )}

        {/* ========================================
            NO PLANS
        ======================================== */}

        {!error &&
          recommendedPlans.length === 0 && (
            <section className="recommendation-notice">

              <div className="notice-icon">
                !
              </div>

              <div>

                <strong>
                  No insurance plans found
                </strong>

                <p>
                  No plans are currently available
                  for recommendation.
                </p>

              </div>

            </section>
          )}

        {/* ========================================
            AI PROCESS
        ======================================== */}

        <section className="recommendation-explanation">

          <p className="section-label">
            AI RECOMMENDATION PROCESS
          </p>

          <h2>
            How FamilyCare AI Selected Your Plans
          </h2>

          <p className="explanation-intro">
            FamilyCare AI evaluates each available plan
            against your family's individual profile rather
            than simply displaying the same plans for everyone.
          </p>

          <div className="explanation-grid">

            <div className="explanation-card">

              <span>
                01
              </span>

              <h3>
                Analyze Family
              </h3>

              <p>
                The system analyzes family size, ages,
                income, health information, smoking status
                and possible maternity requirements.
              </p>

            </div>

            <div className="explanation-card">

              <span>
                02
              </span>

              <h3>
                Compare Market Plans
              </h3>

              <p>
                Available insurance plans are compared
                using their stored coverage, insurer
                information and policy features.
              </p>

            </div>

            <div className="explanation-card">

              <span>
                03
              </span>

              <h3>
                Calculate AI Match
              </h3>

              <p>
                Each plan receives a suitability score
                based on how closely its available features
                match your family's circumstances.
              </p>

            </div>

            <div className="explanation-card">

              <span>
                04
              </span>

              <h3>
                Recommend 4
              </h3>

              <p>
                The four highest-ranked plans are displayed
                with an AI Match Score, personalized reasons
                and estimated premiums.
              </p>

            </div>

          </div>

        </section>

        {/* ========================================
            FINAL NOTE
        ======================================== */}

        <section className="recommendation-final-note">

          <h3>
            💡 Important
          </h3>

          <p>
            FamilyCare AI provides an educational comparison
            and suitability ranking. The AI Match Score and
            estimated premium are project estimates and do
            not represent an official insurer quotation,
            underwriting decision or policy approval.
          </p>

        </section>

      </main>

    </div>
  );
}

export default Recommendation;