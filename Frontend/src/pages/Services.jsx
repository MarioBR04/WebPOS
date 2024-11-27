// src/pages/ProductDetails.jsx
import "./pages.css";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="main">
      <h1>Product Details</h1>
      <p>Viewing details for product {id}</p>
    </div>
  );
}
