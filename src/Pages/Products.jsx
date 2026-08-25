import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./Products.css";

import products from "../data/Products";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import Sidebar from "../Components/Sidebar/Sidebar";
import SearchBar from "../Components/SearchBar/SearchBar";
import ProductCard from "../Components/ProductCard/ProductCard";

function Products() {

  const [searchParams] = useSearchParams();

  const [category, setCategory] = useState(
    searchParams.get("category") || "All"
  );

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {

    const selected =
      searchParams.get("category") || "All";

    setCategory(selected);

  }, [searchParams]);



  let filteredProducts = products.filter((item) => {

    const matchCategory =
      category === "All" ||
      item.category === category;

    const matchSearch =
      item.name
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchCategory && matchSearch;

  });



  if (sortBy === "low") {

    filteredProducts.sort(
      (a, b) => a.price - b.price
    );

  }

  if (sortBy === "high") {

    filteredProducts.sort(
      (a, b) => b.price - a.price
    );

  }

  if (sortBy === "name") {

    filteredProducts.sort(
      (a, b) =>
        a.name.localeCompare(b.name)
    );

  }



  return (

    <>

      <Navbar />

      <div className="products-page">

        <div className="products-content">

          {/* Sticky Top Bar */}

          <div className="products-top">

            <Sidebar
              category={category}
              setCategory={setCategory}
            />

            <div className="search-wrapper">

              <SearchBar
                search={search}
                setSearch={setSearch}
              />

            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e)=>
                setSortBy(e.target.value)
              }
            >

              <option value="default">
                Sort By
              </option>

              <option value="low">
                Price : Low → High
              </option>

              <option value="high">
                Price : High → Low
              </option>

              <option value="name">
                A → Z
              </option>

            </select>

          </div>

          <p className="result-count">

            {filteredProducts.length}
            {" "}
            Products Found

          </p>

          <div className="product-grid">

            {

              filteredProducts.length > 0

              ?

              filteredProducts.map((product)=>(

                <ProductCard
                  key={product.id}
                  product={product}
                />

              ))

              :

              <div className="no-products">

                😔 No Products Found

              </div>

            }

          </div>

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Products;