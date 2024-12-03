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

  // Función para eliminar un producto
  const deleteProduct = (productId) => {
    setInventory((prevInventory) => prevInventory.filter((product) => product.id !== productId));
  };

  // Función para manejar los cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Función para agregar un nuevo producto
  const addProduct = () => {
    if (!newProduct.name || !newProduct.number || !newProduct.price || !newProduct.available) {
      alert("Todos los campos son obligatorios");
      return;
    }

    setInventory((prev) => [
      ...prev,
      {
        id: prev.length + 1, // Genera un ID único
        name: newProduct.name,
        number: newProduct.number,
        price: parseFloat(newProduct.price),
        available: parseInt(newProduct.available),
        incoming: parseInt(newProduct.incoming || 0),
      },
    ]);

    // Reiniciar formulario
    setNewProduct({
      name: "",
      number: "",
      price: "",
      available: "",
      incoming: "",
    });
  };

  return (
    <div className="main">
      <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>

      {/* Tabla del Inventario */}
      <table className="w-full mt-6 bg-white rounded-lg shadow border border-gray-300">
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

      {/* Formulario para Agregar Nuevo Producto */}
      <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Agregar Nuevo Producto</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nombre del Producto"
            value={newProduct.name}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="number"
            placeholder="Número del Producto"
            value={newProduct.number}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={newProduct.price}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            name="available"
            placeholder="Cantidad Disponible"
            value={newProduct.available}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded"
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
    </div>
  );
}
