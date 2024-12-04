import "./pages.css";
import { Link } from "react-router-dom";
import "./cart.css";
import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Payment from "./PaymentModal";

const GET_PRODUCTS = gql`
  query GetProducts($username: String!) {
    products(username: $username) {
      id
      username
      name
      price
      category
      barcode
      stock
    }
  }
`;

export default function NewSale() {
  var total = 0;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { username: localStorage.getItem("user") },
  });

  const [cart, setCart] = useState([]);

  // Añadir producto al carrito
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      alert(
        "Este producto ya está en el carrito. Puedes ajustar la cantidad en el carrito."
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Actualizar cantidad del producto en el carrito
  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: parseInt(quantity) } : item
      )
    );
  };

  // Calcular total de la orden
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar productos: {error.message}</p>;

  return (
    <div className="main">
      <h1 className="text-3xl font-bold text-gray-900">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <div
            key={product.barcode}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-gray-600">Item Number: {product.barcode}</p>
            <p className="text-gray-800">Price: ${product.price}</p>
            <p className="text-gray-800">Stock: {product.stock}</p>
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
                <li
                  key={item.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Item Number: {item.barcode}
                    </p>
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, e.target.value)}
                      className="mt-2 p-2 border rounded"
                    />
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
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
                {(total = calculateTotal())}
                <span>${total}</span>
              </div>
              <button
                className="p-4 bg-gray-800 text-white rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Iniciar Pago
              </button>

              <Payment
                price={total}
                cart={cart}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
