import "./pages.css";
import { Link } from "react-router-dom";
import "./cart.css";
import React, { useState } from "react";

export default function NewSale() {
  const products = [
    { id: 1, name: "Table Material Description", price: 56, number: "#3638" },
    { id: 2, name: "Chair Material Description", price: 45, number: "#3639" },
    { id: 3, name: "Lamp", price: 30, number: "#3640" },
    { id: 4, name: "Desk Organizer", price: 20, number: "#3641" },
    { id: 5, name: "Monitor Stand", price: 40, number: "#3642" },
    { id: 6, name: "Office Chair", price: 120, number: "#3643" },
    
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="main">
      <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
            <p className="text-gray-600">Item Number: {product.number}</p>
            <p className="text-gray-800">Price: ${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary mt-10 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900">Cart Summary</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-300">
              {cart.map((item) => (
                <li key={item.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">Item Number: {item.number}</p>
                  </div>
                  <p className="font-medium text-gray-900">${item.price}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="order-total mt-6">
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Order Total</span>
                <span>${calculateTotal()}</span>
              </div>
              <label className="flex items-center mt-4 text-sm text-gray-800">
                <input type="checkbox" className="mr-2" />
                By checking this box, I agree to the Terms of Service.
              </label>
              <button
                className="mt-4 w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
  );
}
