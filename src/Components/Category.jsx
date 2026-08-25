import { Link } from "react-router-dom";
import "./Category.css";

function Category() {
  return (
    <section className="category">

      <h2>🎨 Explore Our Creations</h2>

      <div className="category-container">

        <Link to="/products?category=Tote Bags">
          👜 Tote Bags
        </Link>

        <Link to="/products?category=Keychains">
          🔑 Keychains
        </Link>

        <Link to="/products?category=Coasters">
          🖼️ Wall Coaster
        </Link>

        <Link to="/products?category=Custom Gifts">
          🎁 Custom Gifts
        </Link>

      </div>

    </section>
  );
}

export default Category;