import React, { useEffect, useState } from "react";

const Test = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        if (data) {
          setProducts(data);
        }
      } catch (error) {
        console.log("Error fetching the data", error);
      }
    }
    fetchData();
  }, []);

  // 🧩 Sorting logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "price-low-high") {
      return a.price - b.price;
    } else if (sortOption === "price-high-low") {
      return b.price - a.price;
    } else if (sortOption === "rating-high-low") {
      return b.rating.rate - a.rating.rate;
    } else if (sortOption === "rating-low-high") {
      return a.rating.rate - b.rating.rate;
    }
    return 0;
  });

  // 🧩 Filtered by search
  const filteredProducts = sortedProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col px-4 py-6">
      <h1 className="text-4xl font-bold text-center mb-6">Product Page</h1>

      {/* Search and Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Sort By</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="rating-high-low">Rating: High to Low</option>
          <option value="rating-low-high">Rating: Low to High</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 shadow-md hover:shadow-lg transition duration-300"
          >
            <img
              src={product.image}
              alt={product.title}
              className="h-20 w-full object-contain mb-4"
            />
            <h2 className="text-md font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-1">${product.price}</p>
            <p className="text-yellow-500 mb-1">
              ⭐ {product.rating.rate} ({product.rating.count} reviews)
            </p>
            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;
