import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    if (!email.trim()) {

      alert("Enter your email.");

      return;

    }

    if (!password.trim()) {

      alert("Enter your password.");

      return;

    }

    setLoading(true);

    try {

      const userCredential =
        await signInWithEmailAndPassword(

          auth,

          email.trim(),

          password

        );

      const user =
        userCredential.user;

      localStorage.setItem(

        "user",

        JSON.stringify({

          uid: user.uid,

          email: user.email,

          displayName:
            user.displayName ||
            "RongTuli User",

          photoURL:
            user.photoURL || ""

        })

      );

      window.dispatchEvent(
        new Event("storage")
      );

      const pending =
        JSON.parse(

          localStorage.getItem(
            "pendingAction"
          )

        );

      if (pending) {

        if (
          pending.type ===
          "wishlist"
        ) {

          let wishlist =
            JSON.parse(
              localStorage.getItem(
                "wishlist"
              )
            ) || [];

          const exists =
            wishlist.some(

              item =>
                item.id ===
                pending.product.id

            );

          if (!exists) {

            wishlist.push(
              pending.product
            );

            localStorage.setItem(

              "wishlist",

              JSON.stringify(
                wishlist
              )

            );

          }

          localStorage.removeItem(
            "pendingAction"
          );

          navigate("/wishlist");

          return;

        }

        if (
          pending.type ===
          "cart"
        ) {

          let cart =
            JSON.parse(
              localStorage.getItem(
                "cart"
              )
            ) || [];

          const existing =
            cart.find(

              item =>
                item.id ===
                pending.product.id

            );

          if (existing) {

            existing.quantity += 1;

          }

          else {

            cart.push({

              ...pending.product,

              quantity: 1,

            });

          }

          localStorage.setItem(

            "cart",

            JSON.stringify(cart)

          );

          localStorage.removeItem(
            "pendingAction"
          );

          navigate("/cart");

          return;

        }
                if (
          pending.type ===
          "buy"
        ) {

          localStorage.setItem(

            "buyNow",

            JSON.stringify({

              ...pending.product,

              quantity: 1,

            })

          );

          localStorage.removeItem(
            "pendingAction"
          );

          navigate("/checkout");

          return;

        }

      }

      alert(
        "Login Successful ✅"
      );

      navigate(from, {
        replace: true,
      });

    }

    catch (error) {

      console.log(error);

      switch (error.code) {

        case "auth/user-not-found":

          alert(
            "No account found with this email."
          );

          break;

        case "auth/wrong-password":

          alert(
            "Wrong password."
          );

          break;

        case "auth/invalid-email":

          alert(
            "Invalid email address."
          );

          break;

        case "auth/invalid-credential":

          alert(
            "Incorrect email or password."
          );

          break;

        case "auth/too-many-requests":

          alert(
            "Too many attempts. Try again later."
          );

          break;

        default:

          alert(error.message);

      }

    }

    finally {

      setLoading(false);

    }

  };
    return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff7fb",
      }}
    >

      <form
        onSubmit={handleSubmit}
        style={{
          width: "380px",
          background: "#fff",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0 8px 20px rgba(0,0,0,.1)",
        }}
      >

        <h2
          style={{
            textAlign: "center",
            color: "#d86b9a",
            marginBottom: "25px",
          }}
        >
          Welcome Back
        </h2>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {
            loading
              ? "Logging In..."
              : "Login"
          }
        </button>

        <div
          style={{
            textAlign: "right",
            marginTop: "12px",
          }}
        >

          <Link
            to="/forgot-password"
            style={{
              color: "#d86b9a",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Forgot Password?
          </Link>

        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "25px",
          }}
        >

          Don't have an account?

          <Link
            to="/signup"
            style={{
              marginLeft: "6px",
              color: "#d86b9a",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>

        </p>

      </form>

    </div>

  );

}

const inputStyle = {

  width: "100%",

  padding: "14px",

  marginBottom: "18px",

  border: "1px solid #ddd",

  borderRadius: "10px",

  outline: "none",

  boxSizing: "border-box",

};

const buttonStyle = {

  width: "100%",

  padding: "14px",

  border: "none",

  borderRadius: "30px",

  background: "#d86b9a",

  color: "#fff",

  fontWeight: "600",

  fontSize: "16px",

  cursor: "pointer",

};

export default Login;