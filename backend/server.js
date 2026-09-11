const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const { Resend } = require("resend");
const OpenAI = require("openai");

require("dotenv").config();


// =====================================================
// OPENAI
// =====================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// =====================================================
// EXPRESS APP
// =====================================================

const app = express();


// =====================================================
// RESEND
// =====================================================

const resend = new Resend(
  process.env.RESEND_API_KEY
);


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// POSTGRESQL CONNECTION
// =====================================================

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// =====================================================
// TEMPORARY OTP STORAGE
// =====================================================

const otpStore = {};


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {

  res.json({
    message: "Family Insurance AI backend is running!"
  });

});


// =====================================================
// DATABASE TEST
// =====================================================

app.get("/api/test-db", async (req, res) => {

  try {

    const result =
      await pool.query("SELECT NOW()");

    res.json({

      success: true,

      message:
        "PostgreSQL connected successfully!",

      time:
        result.rows[0].now

    });

  } catch (error) {

    console.error(
      "DATABASE ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Database connection failed"

    });

  }

});


// =====================================================
// SIGN UP
// =====================================================

app.post("/api/signup", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;


    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Name, email and password are required."

      });

    }


    if (password.length < 6) {

      return res.status(400).json({

        success: false,

        message:
          "Password must contain at least 6 characters."

      });

    }


    const existingUser =
      await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [
          email.trim().toLowerCase()
        ]
      );


    if (
      existingUser.rows.length > 0
    ) {

      return res.status(409).json({

        success: false,

        message:
          "An account with this email already exists."

      });

    }


    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );


    const result =
      await pool.query(
        `
        INSERT INTO users
        (
          name,
          email,
          password_hash
        )
        VALUES
        (
          $1,
          $2,
          $3
        )
        RETURNING
          id,
          name,
          email,
          created_at
        `,
        [
          name.trim(),
          email.trim().toLowerCase(),
          passwordHash
        ]
      );


    res.status(201).json({

      success: true,

      message:
        "Account created successfully!",

      user:
        result.rows[0]

    });


  } catch (error) {

    console.error(
      "SIGNUP ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to create account."

    });

  }

});


// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email and password are required."

      });

    }


    const result =
      await pool.query(
        `
        SELECT
          id,
          name,
          email,
          password_hash,
          created_at
        FROM users
        WHERE email = $1
        `,
        [
          email.trim().toLowerCase()
        ]
      );


    if (
      result.rows.length === 0
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password."

      });

    }


    const user =
      result.rows[0];


    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password_hash
      );


    if (!passwordMatch) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password."

      });

    }


    res.json({

      success: true,

      message:
        "Login successful!",

      user: {

        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        created_at:
          user.created_at

      }

    });


  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to login."

    });

  }

});


// =====================================================
// FORGOT PASSWORD - SEND OTP
// =====================================================

app.post("/api/forgot-password", async (req, res) => {

  try {

    const { email } = req.body;


    if (!email) {

      return res.status(400).json({

        success: false,

        message:
          "Email address is required."

      });

    }


    const cleanEmail =
      email.trim().toLowerCase();


    const result =
      await pool.query(
        `SELECT id, name, email
         FROM users
         WHERE email = $1`,
        [cleanEmail]
      );


    if (
      result.rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "No account found with this email address."

      });

    }


    const user =
      result.rows[0];


    const otp =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();


    const expiresAt =
      Date.now() +
      5 * 60 * 1000;


    otpStore[cleanEmail] = {

      otp,

      userId:
        user.id,

      expiresAt,

      verified:
        false

    };


    const { data, error } =
      await resend.emails.send({

        from:
          "FamilyCare <onboarding@resend.dev>",

        to:
          [cleanEmail],

        subject:
          "FamilyCare Password Reset OTP",

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">

            <h2 style="color: #2563eb; margin-bottom: 5px;">
              FamilyCare
            </h2>

            <p style="color: #64748b; margin-top: 0;">
              Secure Today • Healthy Tomorrow
            </p>

            <h1 style="color: #111827;">
              Password Reset
            </h1>

            <p style="color: #374151;">
              Hello ${user.name},
            </p>

            <p style="color: #374151;">
              We received a request to reset your FamilyCare account password.
              Use the verification code below:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">
                ${otp}
              </span>
            </div>

            <p style="color: #6b7280;">
              This OTP is valid for 5 minutes.
            </p>

            <p style="color: #6b7280;">
              If you did not request a password reset, you can safely ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

            <p style="font-size: 13px; color: #9ca3af;">
              FamilyCare • Secure Today • Healthy Tomorrow
            </p>

          </div>
        `

      });


    if (error) {

      console.error(
        "RESEND EMAIL ERROR:",
        error
      );

      delete otpStore[cleanEmail];


      return res.status(500).json({

        success: false,

        message:
          "Unable to send OTP email. Please try again."

      });

    }


    console.log(
      "Password reset OTP email sent successfully."
    );

    console.log(
      "Email:",
      cleanEmail
    );


    res.json({

      success: true,

      message:
        "OTP sent successfully to your email."

    });


  } catch (error) {

    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to send OTP."

    });

  }

});


// =====================================================
// VERIFY OTP
// =====================================================

app.post(
  "/api/verify-otp",
  async (req, res) => {

    try {

      const {
        email,
        otp
      } = req.body;


      if (
        !email ||
        !otp
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email and OTP are required."

        });

      }


      const cleanEmail =
        email.trim().toLowerCase();


      const storedOtp =
        otpStore[cleanEmail];


      if (!storedOtp) {

        return res.status(400).json({

          success: false,

          message:
            "OTP not found. Please request a new OTP."

        });

      }


      if (
        Date.now() >
        storedOtp.expiresAt
      ) {

        delete otpStore[cleanEmail];


        return res.status(400).json({

          success: false,

          message:
            "OTP has expired. Please request a new OTP."

        });

      }


      if (
        otp.toString() !==
        storedOtp.otp
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid OTP. Please try again."

        });

      }


      otpStore[cleanEmail] = {

        ...storedOtp,

        verified:
          true

      };


      res.json({

        success: true,

        message:
          "OTP verified successfully."

      });


    } catch (error) {

      console.error(
        "VERIFY OTP ERROR:",
        error
      );


      res.status(500).json({

        success: false,

        message:
          "Failed to verify OTP."

      });

    }

  }
);


// =====================================================
// RESET PASSWORD
// =====================================================

app.post(
  "/api/reset-password",
  async (req, res) => {

    try {

      const {
        email,
        newPassword
      } = req.body;


      if (
        !email ||
        !newPassword
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email and new password are required."

        });

      }


      if (
        newPassword.length < 6
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Password must contain at least 6 characters."

        });

      }


      const cleanEmail =
        email.trim().toLowerCase();


      const storedOtp =
        otpStore[cleanEmail];


      if (
        !storedOtp ||
        !storedOtp.verified
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please verify the OTP first."

        });

      }


      const passwordHash =
        await bcrypt.hash(
          newPassword,
          10
        );


      await pool.query(
        `
        UPDATE users
        SET password_hash = $1
        WHERE email = $2
        `,
        [
          passwordHash,
          cleanEmail
        ]
      );


      delete otpStore[cleanEmail];


      res.json({

        success: true,

        message:
          "Password reset successfully."

      });


    } catch (error) {

      console.error(
        "RESET PASSWORD ERROR:",
        error
      );


      res.status(500).json({

        success: false,

        message:
          "Failed to reset password."

      });

    }

  }
);


// =====================================================
// GET INSURANCE PLANS
// =====================================================

app.get("/api/plans", async (req, res) => {

  try {

    const result =
      await pool.query(
        `
        SELECT *
        FROM insurance_plans
        ORDER BY id
        `
      );


    res.json({

      success: true,

      plans:
        result.rows

    });


  } catch (error) {

    console.error(
      "PLANS ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to fetch insurance plans"

    });

  }

});


// =====================================================
// SAVE FAMILY DETAILS
// =====================================================

app.post("/api/families", async (req, res) => {

  console.log(
    "POST /api/families received"
  );


  try {

    const {
      userId,
      family,
      members
    } = req.body;


    if (!userId) {

      return res.status(400).json({

        success: false,

        message:
          "User ID is required."

      });

    }


    if (!family) {

      return res.status(400).json({

        success: false,

        message:
          "Family details are required."

      });

    }


    if (
      !members ||
      members.length === 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "At least one family member is required."

      });

    }


    let annualIncome =
      family.annualIncome;


    if (
      annualIncome ===
      "above_5_lakh"
    ) {

      annualIncome = 500000;

    }

    else if (
      annualIncome ===
      "above_10_lakh"
    ) {

      annualIncome = 1000000;

    }

    else {

      annualIncome =
        Number(annualIncome);

    }


    const familyResult =
      await pool.query(
        `
        INSERT INTO families
        (
          user_id,
          family_name,
          annual_income,
          city,
          state
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5
        )
        RETURNING id
        `,
        [

          Number(userId),

          family.familyName,

          annualIncome,

          family.city,

          family.state

        ]
      );


    const familyId =
      familyResult.rows[0].id;


    for (
      const member of members
    ) {

      await pool.query(
        `
        INSERT INTO family_members
        (
          family_id,
          name,
          age,
          gender,
          occupation,
          smoker,
          health_conditions
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7
        )
        `,
        [

          familyId,

          member.name,

          Number(member.age),

          member.gender,

          member.occupation,

          member.smoker === "Yes",

          member.healthConditions

        ]
      );

    }


    res.json({

      success: true,

      message:
        "Family details saved successfully!",

      familyId

    });


  } catch (error) {

    console.error(
      "FAMILY SAVE ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to save family details."

    });

  }

});


// =====================================================
// AI CHATBOT
// =====================================================

app.post("/api/chat", async (req, res) => {

  try {

    const { message,familyData } = req.body;


    if (
      !message ||
      !message.trim()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Message is required."

      });

    }


    // =================================================
    // REAL OPENAI REQUEST
    // =================================================

    const response =
      await openai.responses.create({

        model: "gpt-5.6-luna",

        instructions: `
You are FamilyCare AI Assistant, an AI assistant for a family health insurance recommendation website.

Your job is to help users understand health insurance in simple and clear language.

You can explain:
- Health insurance
- Family health insurance
- Sum insured
- Premiums
- Waiting periods
- Cashless hospitalization
- Maternity coverage
- Critical illness coverage
- Room rent limits
- Insurance benefits
- Insurance plan comparisons
- How to apply for insurance

Important rules:

1. Give simple, beginner-friendly answers.
2. Do not claim that an estimated FamilyCare premium is an official insurer quotation.
3. Do not guarantee that an insurance claim will be approved.
4. Do not present yourself as an insurance agent, doctor, lawyer, or financial advisor.
5. If a user asks for medical diagnosis or treatment, explain that you can provide general information but they should consult a qualified medical professional.
6. If the user asks about a specific insurance company's current policy terms, explain that exact terms can vary by policy variant and official policy documents.
7. Do not invent insurance policy details.
8. Keep answers reasonably short and useful.
9. Use Indian Rupees when discussing Indian insurance examples.
10. The website's recommendation scores and estimated premiums are FamilyCare project estimates, not official insurer quotations.
11. If the user asks which plan is best, explain that the best plan depends on family size, ages, health conditions, income, coverage needs, and other factors.
12. Be friendly and professional.
13. Never ask the user for passwords, API keys, OTPs, or other secrets.

You are part of a college project called FamilyCare / Family Insurance AI.
`,

        input: `
User question:
${message.trim()}

FamilyCare recommendation data:
${JSON.stringify(familyData || {}, null, 2)}
`,
      });


    const reply =
      response.output_text ||
      "Sorry, I could not generate a response right now.";


    res.json({

      success: true,

      reply

    });


  } catch (error) {

    console.error(
      "CHAT ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Unable to connect to FamilyCare AI right now. Please try again."

    });

  }

});


// =====================================================
// START SERVER
// =====================================================

const PORT = 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `Backend running at http://localhost:${PORT}`
    );

  }
);