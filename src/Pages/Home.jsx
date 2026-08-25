import Navbar from "../Components/Navbar/Navbar";
import Hero from "../Components/Hero/Hero";
import Category from "../Components/Category";
import Footer from "../Components/Footer/Footer";
import ProductCard from "../Components/ProductCard/ProductCard";
import products from "../data/Products";
import About from "../Components/About/About";
import "./Home.css";

function Home() {

  const featuredProducts = [
    products.find((p) => p.name === "Tulip Tote Bag"),
    products.find((p) => p.name === "Gojo Mini Canvas"),
    products.find((p) => p.name === "Mahadev Coaster"),
    products.find((p) => p.name === "Cat Keychain"),
  ].filter(Boolean);

  return (
    <>
      <Navbar />

      <Hero />

      <Category />

      <section className="featured">

        <h2>🔥 Best Sellers</h2>

        <div className="product-grid">

          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </section>

      <About />

      <Footer />
    </>
  );
}

export default Home;