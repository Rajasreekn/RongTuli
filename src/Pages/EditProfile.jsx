import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

import "./EditProfile.css";

function EditProfile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [photoURL, setPhotoURL] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      setName(user.displayName || "");
      setEmail(user.email || "");
      setPhotoURL(user.photoURL || "");

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();

          setName(data.displayName || user.displayName || "");
          setEmail(data.email || user.email || "");
          setPhone(data.phone || "");
          setPhotoURL(data.photoURL || user.photoURL || "");
        }
      } catch (error) {
        console.error("Load profile error:", error);
      }
    };

    loadUser();
  }, [navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB.");
      return;
    }

    setPhotoFile(file);
    setPhotoURL(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
await user.reload();

const freshUser = auth.currentUser;

if (!freshUser) {
  alert("Session expired. Please login again.");
  localStorage.removeItem("user");
  navigate("/login");
  return;
}
    if (!user) {
      navigate("/login");
      return;
    }

    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const oldEmail = (user.email || "").trim().toLowerCase();
      const newEmail = email.trim().toLowerCase();

// Cloudinary upload yahan hoga
let finalPhotoURL = freshUser.photoURL || "";

if (photoFile) {
  const formData = new FormData();

  formData.append("file", photoFile);
  formData.append("upload_preset", "rongtuli_profile");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/sw4aubbq/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary upload failed.");
  }

  finalPhotoURL = data.secure_url;
}
      // -----------------------------
      // EMAIL CHANGE
      // -----------------------------
if (newEmail !== oldEmail) {

  if (!currentPassword) {
    alert("Enter your current password.");
    setLoading(false);
    return;
  }

  const credential = EmailAuthProvider.credential(
    oldEmail,
    currentPassword
  );

  await reauthenticateWithCredential(user, credential);

  const token = await freshUser.getIdToken(true);

  const response = await fetch(
    "http://localhost:5000/api/update-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uid: freshUser.uid,
        newEmail,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Email update failed.");
  }

  await freshUser.reload();
}

      // -----------------------------
      // UPDATE FIREBASE PROFILE
      // -----------------------------
await updateProfile(freshUser, {
  displayName: name.trim(),
  photoURL: finalPhotoURL || null,
});

      // -----------------------------
      // UPDATE FIRESTORE
      // -----------------------------

    await updateDoc(doc(db, "users", freshUser.uid), {
  displayName: name.trim(),
  email: newEmail,
  phone: phone.trim(),
  photoURL: finalPhotoURL,
});

      // -----------------------------
      // UPDATE LOCAL STORAGE
      // -----------------------------

      const oldUser =
        JSON.parse(
          localStorage.getItem("user")
        ) || {};

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...oldUser,
          uid: user.uid,
          displayName: name.trim(),
          email: newEmail,
          phone: phone.trim(),
          photoURL: finalPhotoURL,
        })
      );

      window.dispatchEvent(
        new Event("storage")
      );

      alert("Profile updated successfully!");

      navigate("/profile");

    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        alert(
          "Current password is incorrect."
        );
      }

      else if (
        error.code ===
        "auth/wrong-password"
      ) {
        alert(
          "Current password is incorrect."
        );
      }

      else if (
        error.message?.includes(
          "EMAIL_ALREADY_EXISTS"
        )
      ) {
        alert(
          "This email is already being used by another account."
        );
      }

      else if (
        error.message?.includes(
          "auth/email-already-exists"
        )
      ) {
        alert(
          "This email is already being used by another account."
        );
      }

      else if (
        error.code ===
        "auth/invalid-email"
      ) {
        alert(
          "Invalid email address."
        );
      }

      else {
        alert(
          error.message ||
          "Failed to update profile."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="edit-profile-page">

        <div className="edit-profile-card">

          <h2>Edit Profile</h2>

          <div className="edit-profile-photo">

            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
              />
            ) : (
              <div className="profile-placeholder">
                {name
                  ? name.charAt(0).toUpperCase()
                  : "U"}
              </div>
            )}

            <label htmlFor="profilePhoto">
              Change Photo
            </label>

            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />

          </div>

          <form onSubmit={handleSave}>

            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
            />

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
            />

            {email.trim().toLowerCase() !==
              auth.currentUser?.email?.toLowerCase() && (
              <>
                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                />

                <small>
                  Your current password will remain
                  the same after changing email.
                </small>
              </>
            )}

            <label>Phone</label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter phone number"
            />

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>

        </div>

      </div>

      <Footer />
    </>
  );
}

export default EditProfile;