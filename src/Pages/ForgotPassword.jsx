// src/Pages/ForgotPassword.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const [resetToken, setResetToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  // =====================================================
  // RESEND TIMER
  // =====================================================

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  // =====================================================
  // SEND OTP
  // =====================================================

  const sendOTP = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter your registered email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const data = await res.json();

      console.log("SEND OTP STATUS =", res.status);
      console.log("SEND OTP DATA =", data);

      if (data.success) {
        setEmail(cleanEmail);
        setOtp("");
        setOtpSent(true);
        setVerified(false);
        setResetToken("");

        // 60 seconds before another OTP can be requested
        setResendTimer(60);

        alert("OTP sent to your registered email ✅");
      } else {
        alert(data.message || "Unable to send OTP");
      }
    } catch (error) {
      console.error("SEND OTP ERROR:", error);

      alert(
        "Server not connected. Please make sure the RongTuli backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const verifyOTP = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOTP = otp.trim();

    if (!cleanOTP) {
      alert("Please enter the OTP");
      return;
    }

    if (cleanOTP.length !== 6) {
      alert("OTP must be 6 digits");
      return;
    }

    try {
      setVerifyLoading(true);

      const res = await fetch(
        "http://localhost:5000/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            otp: cleanOTP,
          }),
        }
      );

      const data = await res.json();

      console.log("VERIFY OTP STATUS =", res.status);
      console.log("VERIFY OTP DATA =", data);

      if (data.success && data.resetToken) {
        setVerified(true);
        setResetToken(data.resetToken);

        alert("OTP Verified Successfully ✅");
      } else {
        setVerified(false);
        setResetToken("");

        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("VERIFY OTP ERROR:", error);

      alert("Verification failed. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // =====================================================
  // CHANGE EMAIL
  // =====================================================

  const changeEmail = () => {
    setOtpSent(false);
    setVerified(false);
    setResetToken("");
    setOtp("");
    setResendTimer(0);
  };

  // =====================================================
  // GO TO RESET PASSWORD
  // =====================================================

  const goReset = () => {
    if (!verified || !resetToken) {
      alert("Please verify your OTP first");
      return;
    }

    navigate("/reset-password", {
      state: {
        email: email.trim().toLowerCase(),
        resetToken: resetToken,
      },
    });
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        <h1>Forgot Password?</h1>

       <p>
  Reset your password securely
</p>

        {/* EMAIL SECTION */}

        <label>Email Address</label>

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent}
        />

        {/* INITIAL GET OTP */}

        {!otpSent && (
          <button
            className="main-btn"
            onClick={sendOTP}
            disabled={loading}
          >
            {loading ? "Sending..." : "Get OTP"}
          </button>
        )}

        {/* OTP SECTION */}

        {otpSent && !verified && (
          <div className="otp-section">

            <div className="otp-info">
              <span>
                OTP sent to <strong>{email}</strong>
              </span>
            </div>

            <label>Enter OTP</label>

            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setOtp(value);
              }}
            />

            {/* VERIFY ONLY */}

            <button
              className="main-btn"
              onClick={verifyOTP}
              disabled={verifyLoading}
            >
              {verifyLoading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* RESEND */}

            {resendTimer > 0 ? (
              <div className="resend-timer">
                Didn't receive the OTP?{" "}
                <span>Resend OTP in {resendTimer}s</span>
              </div>
            ) : (
              <button
                type="button"
                className="resend-btn"
                onClick={sendOTP}
                disabled={loading}
              >
                {loading ? "Sending..." : "Resend OTP"}
              </button>
            )}

            {/* CHANGE EMAIL */}

            <button
              type="button"
              className="change-email-btn"
              onClick={changeEmail}
            >
              ← Change Email
            </button>

          </div>
        )}

        {/* VERIFIED */}

        {verified && (
          <div className="verified-section">

            <div className="verified-text">
              OTP Verified Successfully ✅
            </div>

          <p className="verified-info">
  You can now create a new password.
</p>

            <button
              className="reset-btn"
              onClick={goReset}
            >
              Continue to Reset Password
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;