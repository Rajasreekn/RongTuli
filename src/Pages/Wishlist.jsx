import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../Components/ProductCard/ProductCard";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

function Wishlist() {

  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {

      alert("Please login to continue.");

      navigate("/login");

      return;

    }

    const saved =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(saved);

  }, [navigate]);

  return (

    <>

      <Navbar />

      <div
        style={{
          padding: "40px",
          minHeight: "70vh",
        }}
      >

        <h1>
          ❤️ My Wishlist
        </h1>

        {

          wishlist.length === 0 ?

          <p>
            No products in your wishlist.
          </p>

          :

          <div className="product-grid">

            {

              wishlist.map((product)=>(

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))

            }

          </div>

        }

      </div>

      <Footer />

    </>

  );

}

export default Wishlist;