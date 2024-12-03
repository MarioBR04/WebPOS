import React, { useState } from "react";
import "./pages.css";

export default function Inventory() {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Table Material Description", number: "#3638", price: 56, available: 10, incoming: 5 },
    { id: 2, name: "Chair Material Description", number: "#3639", price: 45, available: 8, incoming: 3 },
    { id: 3, name: "Lamp", number: "#3640", price: 30, available: 15, incoming: 10 },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    number: "",
    price: "",
    available: "",
    incoming: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({}); // Estado para manejar los errores

  const deleteProduct = (productId) => {
    setInventory((prevInventory) => prevInventory.filter((product) => product.id !== productId));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false })); // Elimina el error al llenar el campo
  };

  const addProduct = () => {
    const newErrors = {};
    if (!newProduct.name) newErrors.name = true;
    if (!newProduct.number) newErrors.number = true;
    if (!newProduct.price) newErrors.price = true;
    if (!newProduct.available) newErrors.available = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setInventory((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: newProduct.name,
        number: newProduct.number,
        price: parseFloat(newProduct.price),
        available: parseInt(newProduct.available),
        incoming: parseInt(newProduct.incoming || 0),
      },
    ]);

    setNewProduct({
      name: "",
      number: "",
      price: "",
      available: "",
      incoming: "",
    });

    setShowForm(false);
  };

  return (
    <div className="main mx-auto mt-10 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Inventory Management</h1>

      <div className="text-center mb-6">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          {showForm ? "Cerrar Formulario" : "Agregar Nuevo Producto"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 bg-gray-100 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Agregar Nuevo Producto</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre del Producto"
              value={newProduct.name}
              onChange={handleInputChange}
              className={`p-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              type="text"
              name="number"
              placeholder="Número del Producto"
              value={newProduct.number}
              onChange={handleInputChange}
              className={`p-2 border rounded ${errors.number ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={newProduct.price}
              onChange={handleInputChange}
              className={`p-2 border rounded ${errors.price ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              type="number"
              name="available"
              placeholder="Cantidad Disponible"
              value={newProduct.available}
              onChange={handleInputChange}
              className={`p-2 border rounded ${errors.available ? "border-red-500" : "border-gray-300"}`}
            />
            <input
              type="number"
              name="incoming"
              placeholder="Cantidad Entrante (opcional)"
              value={newProduct.incoming}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded"
            />
          </form>
          <button
            onClick={addProduct}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Agregar Producto
          </button>
        </div>
      )}

      <table className="w-full mt-6 bg-white rounded-lg shadow border border-gray-300 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-medium text-gray-800">Producto</th>
            <th className="p-4 text-left font-medium text-gray-800">Número</th>
            <th className="p-4 text-center font-medium text-gray-800">Precio</th>
            <th className="p-4 text-center font-medium text-gray-800">Entrante</th>
            <th className="p-4 text-center font-medium text-gray-800">Disponible</th>
            <th className="p-4 text-center font-medium text-gray-800">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="p-4">{item.name}</td>
              <td className="p-4">{item.number}</td>
              <td className="p-4 text-center">${item.price}</td>
              <td className="p-4 text-center">{item.incoming}</td>
              <td className="p-4 text-center">{item.available}</td>
              <td className="p-4 text-center">
                <button
                  onClick={() => deleteProduct(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
