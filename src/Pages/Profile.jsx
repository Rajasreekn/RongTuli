import { useNavigate } from "react-router-dom";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const name = user.displayName || "RongTuli User";
  const email = user.email || "";

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

    alert("Logged out successfully");

    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="profile-card">

          <div className="profile-header">
            <img
              src={
                user.photoURL ||
                "https://ui-avatars.com/api/?background=d86b9a&color=fff&name=" +
                  encodeURIComponent(name)
              }
              alt="profile"
              className="profile-img"
            />

            <div className="profile-info">
              <h2>{name}</h2>
              <p>{email}</p>
            </div>
          </div>

          <div className="profile-buttons">

            <button onClick={() => navigate("/orders")}>
              📦 My Orders
            </button>

            <button onClick={() => navigate("/edit-profile")}>
              ✏️ Edit Profile
            </button>

            <button onClick={() => navigate("/saved-address")}>
              📍 Saved Address
            </button>

            <button onClick={() => navigate("/my-reviews")}>
              ⭐ My Reviews
            </button>

            <button onClick={() => navigate("/help-center")}>
              ☎️ Help Center
            </button>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Profile;