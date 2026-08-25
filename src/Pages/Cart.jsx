import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

import "./Cart.css";

const FREE_SHIPPING_THRESHOLD = 599;

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];

    const updated = saved.map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 1,
      price:
        Number(
          String(item.price)
            .replace("₹", "")
            .replace(/,/g, "")
        ) || 0,
    }));

    setCart(updated);
  }, []);

  const updateCart = (updated) => {
    setCart(updated);

    localStorage.setItem("cart", JSON.stringify(updated));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Number(item.quantity) + 1,
          }
        : item
    );

    updateCart(updated);
  };

  const decreaseQty = (id) => {
    const current = cart.find((item) => item.id === id);

    if (!current) return;

    if (Number(current.quantity) <= 1) {
      removeItem(id);
      return;
    }

    const updated = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Number(item.quantity) - 1,
          }
        : item
    );

    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);

    updateCart(updated);

    toast.info("Removed from cart");
  };

  const cartTotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const amountToFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - cartTotal,
    0
  );

  const hasFreeShipping =
    cartTotal >= FREE_SHIPPING_THRESHOLD;

  const finalTotal = cartTotal;

  return (
    <>
      <Navbar />

      <div className="cart-container">
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>🛒 Your Cart is Empty</h2>

            <p>Add some beautiful handmade products.</p>

            <button
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                className="cart-row"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-info">
                  <h3>{item.name}</h3>

                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>

                  <h4>
                    ₹
                    {Number(item.price) *
                      Number(item.quantity)}
                  </h4>
                </div>

                <div className="cart-actions">
                  <div className="qty">

                    {/* Quantity number intentionally hidden */}
                    <button
                      onClick={() =>
                        decreaseQty(item.id)
                      }
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>

                    <button
                      onClick={() =>
                        increaseQty(item.id)
                      }
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      +
                    </button>

                  </div>

                  <button
                    className="remove"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div
              className={`free-shipping-message ${
                hasFreeShipping ? "unlocked" : ""
              }`}
            >
              {hasFreeShipping ? (
                <>
                  🎉{" "}
                  <strong>
                    Free Delivery Unlocked!
                  </strong>{" "}
                  Your order is ₹599 or more.
                </>
              ) : (
                <>
                  🚚 Add{" "}
                  <strong>
                    ₹{amountToFreeShipping}
                  </strong>{" "}
                  more to your cart to unlock{" "}
                  <strong>FREE DELIVERY</strong>!
                </>
              )}
            </div>

            <div className="summary">
              <p>
                Cart Total
                <span>₹{cartTotal}</span>
              </p>

              <p>
                Shipping
                <span>
                  {hasFreeShipping
                    ? "FREE"
                    : "Calculated at checkout"}
                </span>
              </p>

              <hr />

              <h2>
                Total
                <span>₹{finalTotal}</span>
              </h2>

              <button
                onClick={() => {
                  localStorage.removeItem("buyNow");
                  navigate("/checkout");
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Cart;