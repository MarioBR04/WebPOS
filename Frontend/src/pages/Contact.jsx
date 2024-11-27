// src/pages/Products.jsx
import "./pages.css";
import { Link } from "react-router-dom";

export default function Products() {
  const products = [
    { id: 1, name: "Product 1" },
    { id: 2, name: "Product 2" },
    { id: 3, name: "Product 3" },
  ];

  return (
    <div className="main">
      <h1 className="text-3xl font-bold">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">Click to view details</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
