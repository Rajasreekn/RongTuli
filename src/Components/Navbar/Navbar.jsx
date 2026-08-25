import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../../assets/Products/logo.jpg";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    const updateUser = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };

    // Update when profile changes
    window.addEventListener("storage", updateUser);

    // Update when returning to tab/page
    window.addEventListener("focus", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("focus", updateUser);
    };
  }, []);

  const requireLogin = (path) => {
    if (!user) {
      alert("Please login to continue.");
      navigate("/login", {
        state: { from: path },
      });
      return;
    }

    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img
            src={logo}
            alt="RongTuli"
            className="navbar-logo"
          />
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/products">Shop</Link>

        <button
          className="nav-icon-btn"
          onClick={() => requireLogin("/wishlist")}
        >
          ♡
        </button>

        <button
          className="nav-icon-btn"
          onClick={() => requireLogin("/cart")}
        >
          🛒
        </button>

        <button
          className="nav-icon-btn"
          onClick={() =>
            user
              ? navigate("/profile")
              : navigate("/login")
          }
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="navbar-profile-img"
            />
          ) : (
            "👤"
          )}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;