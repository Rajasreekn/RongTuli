// server/index.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

dotenv.config();

const app = express();
const serviceAccount = require("./serviceAccountKey.json");
// =====================================================
// MIDDLEWARE
// =====================================================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// =====================================================
// FIREBASE ADMIN
// =====================================================
admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

const auth = getAuth();
const db = getFirestore();

// =====================================================
// OTP STORE
// =====================================================

const crypto = require("crypto");

const otpStore = {};
const resetTokenStore = {};

// =====================================================
// MAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Mail Error:", error);
  } else {
    console.log("✅ Mail Server Ready");
  }
});
console.log("EMAIL_USER:", JSON.stringify(process.env.EMAIL_USER));
console.log("EMAIL_PASS:", JSON.stringify(process.env.EMAIL_PASS));
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RongTuli backend running successfully",
  });
});
// =====================================================
// UPDATE EMAIL
// =====================================================

app.post("/api/update-email", async (req, res) => {
  try {
    const { uid, newEmail } = req.body;

    if (!uid || !newEmail) {
      return res.status(400).json({
        success: false,
        message: "uid and newEmail are required",
      });
    }

    const cleanEmail = newEmail.trim().toLowerCase();

    const firebaseUser = await auth.getUser(uid);

    if (
      firebaseUser.email &&
      firebaseUser.email.toLowerCase() === cleanEmail
    ) {
      return res.status(400).json({
        success: false,
        message: "New email is same as current email",
      });
    }

    try {
      const existingUser =
        await auth.getUserByEmail(cleanEmail);

      if (existingUser.uid !== uid) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

    } catch (err) {
      if (err.code !== "auth/user-not-found") {
        throw err;
      }
    }

    const updatedUser =
      await auth.updateUser(uid, {
        email: cleanEmail,
      });

    await db
      .collection("users")
      .doc(uid)
      .set(
        {
          email: cleanEmail,
          updatedAt:
            admin.firestore.FieldValue.serverTimestamp(),
        },
        {
          merge: true,
        }
      );

    res.json({
      success: true,
      uid: updatedUser.uid,
      email: updatedUser.email,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Email update failed",
    });

  }
});


// =====================================================
// SEND OTP
// =====================================================

app.post("/send-otp", async (req, res) => {
  console.log("========== SEND OTP API HIT ==========");
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();

    try {
      await auth.getUserByEmail(cleanEmail);
    } catch (err) {

      if (err.code === "auth/user-not-found") {
        return res.status(404).json({
          success: false,
          message: "Email is not registered",
        });
      }

      throw err;
    }

    const otp =
      otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true,
      });

    otpStore[cleanEmail] = {
      otp,
      expires:
        Date.now() + 5 * 60 * 1000,
    };

console.log("📨 Sending OTP...");
console.log("FROM:", process.env.EMAIL_USER);
console.log("TO:", cleanEmail);

    await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: cleanEmail,
  subject: "RongTuli Password Reset OTP",
  html: `
    <h2>Password Reset</h2>
    <p>Your OTP is</p>
    <h1>${otp}</h1>
    <p>Valid for 5 minutes.</p>
  `,
});

console.log("✅ OTP mail sent");
    res.json({
      success: true,
      message: "OTP Sent",
    });

  }catch (error) {

  console.log("===== SEND OTP ERROR =====");
  console.log(error);
  console.log("==========================");

  res.status(500).json({
    success: false,
    message: error.message,
  });

}
});

// =====================================================
// VERIFY OTP
// =====================================================

app.post("/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const enteredOTP = otp.trim();

    const savedOTP = otpStore[cleanEmail];

    if (!savedOTP) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or already used",
      });
    }

    // OTP expired
    if (Date.now() > savedOTP.expires) {
      delete otpStore[cleanEmail];

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // OTP incorrect
    if (savedOTP.otp !== enteredOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is correct → remove OTP immediately
    delete otpStore[cleanEmail];

    // Create one-time reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    resetTokenStore[cleanEmail] = {
      token: resetToken,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    console.log("✅ OTP verified for:", cleanEmail);

    return res.json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
});

// =====================================================
// RESET PASSWORD
// =====================================================

app.post("/reset-password", async (req, res) => {
  try {
    const { email, password, resetToken } = req.body;

    if (!email || !password || !resetToken) {
      return res.status(400).json({
        success: false,
        message: "Email, password and reset token are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const savedResetToken = resetTokenStore[cleanEmail];

    // No verified OTP session
    if (!savedResetToken) {
      return res.status(403).json({
        success: false,
        message: "OTP verification required",
      });
    }

    // Reset token expired
    if (Date.now() > savedResetToken.expires) {
      delete resetTokenStore[cleanEmail];

      return res.status(403).json({
        success: false,
        message: "Reset session expired. Please request a new OTP.",
      });
    }

    // Invalid token
    if (savedResetToken.token !== resetToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    // Find Firebase user
    const user = await auth.getUserByEmail(cleanEmail);

    // Update password
    await auth.updateUser(user.uid, {
      password,
    });

    // IMPORTANT:
    // Reset token can be used only once
    delete resetTokenStore[cleanEmail];

    console.log("✅ Password reset successful:", cleanEmail);

    return res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Password reset failed",
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});

console.log("SERVER IS STILL RUNNING...");