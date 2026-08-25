import { useState, useRef, useEffect } from "react";
import "./Sidebar.css";

function Sidebar({ category, setCategory }) {

  const [open, setOpen] = useState(false);

  const sidebarRef = useRef(null);

const categories = [
  "All",
  "Tote Bags",
  "Keychains",
  "Painted Bottles",
  "Canvas",
  "Mini Canvas",
  "Coasters",
  "Fridge Magnets",
  "Bookmarks",
  "Painted Frames",
  "Paper Cards",
  "Paper Bouquets",
  "Wall Hangings",
"Thali Art",
 "Custom Gifts",
];

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  const selectCategory = (item) => {
    setCategory(item);
    setOpen(false);
  };

  return (

    <div
      className="sidebar-wrapper"
      ref={sidebarRef}
    >

      <button
        className="menu-btn"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <div
        className={`sidebar ${open ? "open" : ""}`}
      >

        {categories.map((item) => (

          <button
            key={item}
            className={
              category === item
                ? "active"
                : ""
            }
            onClick={() => selectCategory(item)}
          >
            {item}
          </button>

        ))}

      </div>

    </div>

  );

}

export default Sidebar;