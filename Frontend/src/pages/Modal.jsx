import React, { useState, useEffect } from "react";

const Modal = ({ isOpen, onClose, product, onSave, mode, onDelete }) => {
  const [formData, setFormData] = useState(product || { name: "", price: 0 });

  // Actualiza el estado cuando se abre el modal con un producto nuevo o existente
  useEffect(() => {
    setFormData(product || { name: "", price: "" });
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-10 relative w-2/5 max-w-3xl">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">
          {mode === "edit" ? "Editar Producto" : "Agregar Producto"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nombre del producto"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Precio</label>
            <input
              type="number"
              step="any"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Precio del producto"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Codigo</label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Codigo del producto"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Categoria</label>
            <input
              type="text"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Categoria del producto"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Stock del producto"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {mode === "edit" ? "Guardar Cambios" : "Agregar Producto"}
          </button>
          {mode === "edit" && (
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
              onClick={() => onDelete(product.id)}
            >
              Eliminar Producto
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Modal;
