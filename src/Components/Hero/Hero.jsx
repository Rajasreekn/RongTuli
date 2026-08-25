import "./Hero.css";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <h1>Handmade Gifts Made With Love 🌸</h1>

      <p>
        Every brush stroke tells a story.
        Handmade gifts specially created for you.
      </p>

      <Link to="/products">
        <button>Shop Now</button>
      </Link>

    </section>
  );
}

export default Hero;