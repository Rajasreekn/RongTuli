// src/Pages/ResetPassword.jsx

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

    return regex.test(pass);
  };

  const savePassword = async () => {
    if (!email || !resetToken) {
      alert("Your OTP verification session is missing. Please request a new OTP.");
      navigate("/forgot-password");
      return;
    }

    if (!password || !confirmPassword) {
      alert("Enter both password fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      alert(
        "Password must contain 8 characters, one uppercase, one lowercase, one number and one special character"
      );
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            resetToken,
          }),
        }
      );

      const data = await res.json();

      console.log("RESET PASSWORD STATUS =", res.status);
      console.log("RESET PASSWORD DATA =", data);

      if (data.success) {
        alert("Password changed successfully ✅");

        // Go directly to login
        navigate("/login", {
          replace: true,
        });
      } else {
        alert(data.message || "Password update failed");
      }
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      alert(
        "Server not connected. Please make sure the RongTuli backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">

        <h1>Reset Password</h1>

        <p>Create your new password</p>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />

        <small>
          Password must have:
          <br />
          • 8 characters
          <br />
          • One Capital letter
          <br />
          • One Small letter
          <br />
          • One Number
          <br />
          • One Special character
        </small>

        <button
          className="save-btn"
          onClick={savePassword}
          disabled={loading}
        >
          {loading ? "Changing Password..." : "Save Changes"}
        </button>

      </div>
    </div>
  );
}

export default ResetPassword;