
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";

import ResetPassword from "./Pages/ResetPassword";

import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

import EditProfile from "./Pages/EditProfile";
import MyReviews from "./Pages/MyReviews";
import Profile from "./Pages/Profile";

import Wishlist from "./Pages/Wishlist";
import Orders from "./Pages/Orders";
import Reviews from "./Pages/Reviews";

import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Payment from "./Pages/Payment";

import SavedAddress from "./Pages/SavedAddress";
import HelpCenter from "./Pages/HelpCenter";

import ForgotPassword from "./Pages/ForgotPassword";

import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC PAGES
        ========================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* =========================
            PROTECTED PAGES
        ========================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reviews"
          element={
            <ProtectedRoute>
              <MyReviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-address"
          element={
            <ProtectedRoute>
              <SavedAddress />
            </ProtectedRoute>
          }
        />

        <Route
          path="/help-center"
          element={<HelpCenter />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

