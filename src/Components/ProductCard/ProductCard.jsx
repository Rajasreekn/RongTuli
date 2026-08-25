import "./ProductCard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function ProductCard({ product }) {

  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);

  useEffect(() => {

    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setLiked(
      wishlist.some(
        (item) => item.id === product.id
      )
    );

  }, [product.id]);



  const toggleWishlist = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const user =
      JSON.parse(localStorage.getItem("user"));

    if (!user) {

      localStorage.setItem(
        "pendingAction",
        JSON.stringify({
          type: "wishlist",
          product,
        })
      );

      navigate("/login", {
        state: {
          from: "/products",
        },
      });

      return;

    }

    let wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists =
      wishlist.some(
        (item) => item.id === product.id
      );

    if (exists) {

      wishlist =
        wishlist.filter(
          (item) => item.id !== product.id
        );

      setLiked(false);

      toast.info(
        "Removed from Wishlist 🤍"
      );

    } else {

      wishlist.push(product);

      setLiked(true);

      toast.success(
        "Added to Wishlist ❤️"
      );

    }

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );

  };



  const buyNow = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const user =
      JSON.parse(localStorage.getItem("user"));

    if (!user) {

      localStorage.setItem(
        "pendingAction",
        JSON.stringify({
          type: "buy",
          product,
        })
      );

      navigate("/login", {
        state: {
          from: "/products",
        },
      });

      return;

    }

    localStorage.setItem(
      "buyNow",
      JSON.stringify({
        ...product,
        quantity: 1,
      })
    );

    navigate("/checkout");

  };



  return (

    <div className="product-card">

      <Link
        to={`/product/${product.id}`}
        className="product-link"
      >

        <div className="image-box">

          <img
            src={product.image}
            alt={product.name}
          />

          {!product.stock && (

            <span className="sold-out">
              Out Of Stock
            </span>

          )}

        </div>

        <div className="product-info">

          <h3>{product.name}</h3>

          <div className="product-price">

            {product.oldPrice && (

              <span className="old-price">
                ₹{product.oldPrice}
              </span>

            )}

            <span className="new-price">
              ₹{product.price}
            </span>

          </div>

          {product.discount && (

            <div className="discount-tag">
              {product.discount}
            </div>

          )}

          <p
            className={
              product.stock
                ? "stock"
                : "out"
            }
          >

            {product.stock
              ? "✔ In Stock"
              : "Out Of Stock"}

          </p>

        </div>

      </Link>

      <div className="card-buttons">

        <button
          className="wishlist"
          onClick={toggleWishlist}
        >

          {liked
            ? "❤️ Wishlisted"
            : "🤍 Wishlist"}

        </button>

        <button
          className="buy"
          onClick={buyNow}
          disabled={!product.stock}
        >

          {product.stock
            ? "Buy Now"
            : "Unavailable"}

        </button>

      </div>

    </div>

  );

}

export default ProductCard;