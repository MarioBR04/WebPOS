import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import Modal from "./Modal";

// GraphQL Queries y Mutations
const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $id: ID!
    $name: String
    $price: Float
    $category: String
    $barcode: String
    $stock: Int
    $username: String
  ) {
    editProduct(
      id: $id
      name: $name
      price: $price
      category: $category
      barcode: $barcode
      stock: $stock
      username: $username
    ) {
      id
      name
      price
      category
      barcode
      stock
      username
    }
  }
`;

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

const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $price: Float!
    $category: String
    $barcode: String!
    $stock: Int!
    $username: String!
  ) {
    addProduct(
      name: $name
      price: $price
      category: $category
      barcode: $barcode
      stock: $stock
      username: $username
    ) {
      id
      name
      price
      stock
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export default function Inventory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" o "edit"

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { username: localStorage.getItem("user") },
  });

  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [editProduct] = useMutation(EDIT_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const handleOpenModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (!confirmDelete) return;
    try {
      await deleteProduct({ variables: { id } });
      refetchQueries: [
        {
          query: GET_PRODUCTS,
          variables: { username: localStorage.getItem("user") },
        },
      ],
        alert("Producto eliminado con éxito.");
    } catch (err) {
      console.error("Error al eliminar producto:", err.message);
      console.error(err);
      alert("No se pudo procesar la solicitud.");
    }
  };
  const handleSaveProduct = async (formData) => {
    try {
      if (modalMode === "edit") {
        await editProduct({
          variables: {
            ...formData,
            id: formData.id,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
          },
          refetchQueries: [
            {
              query: GET_PRODUCTS,
              variables: { username: localStorage.getItem("user") },
            },
          ],
        });
        alert("Producto actualizado con éxito.");
      } else {
        await addProduct({
          variables: {
            ...formData,
            username: localStorage.getItem("user"),
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
          },
          refetchQueries: [
            {
              query: GET_PRODUCTS,
              variables: { username: localStorage.getItem("user") },
            },
          ],
        });
        alert("Producto agregado con éxito.");
      }
    } catch (err) {
      console.error("Error al guardar producto:", err.message);
      alert("No se pudo procesar la solicitud.");
    }
    handleCloseModal();
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar productos: {error.message}</p>;

  return (
    <div className="main mx-auto mt-0 max-w-4xl">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6 mt-0">
        Inventory Management
      </h1>

      <div className="text-center mb-6">
        <button
          onClick={() => handleOpenModal("add")}
          className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
        >
          Agregar Nuevo Producto
        </button>
      </div>

      <table className="w-full mt-6 bg-white rounded-lg shadow border border-gray-300 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-center font-medium text-gray-800">
              Codigo
            </th>
            <th className="p-4 text-center font-medium text-gray-800">
              Producto
            </th>
            <th className="p-4 text-center font-medium text-gray-800">
              Precio
            </th>
            <th className="p-4 text-center font-medium text-gray-800">Stock</th>
            <th className="p-4 text-center font-medium text-gray-800">
              Editar
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {data.products.map((product) => (
            <tr key={product.id}>
              <td className="p-4 text-center">{product.barcode}</td>
              <td className="p-4 text-center">{product.name}</td>
              <td className="p-4 text-center">${product.price.toFixed(2)}</td>
              <td className="p-4 text-center">{product.stock}</td>
              <td className="p-4 text-center">
                <button
                  onClick={() => handleOpenModal("edit", product)}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 m-1"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onSave={handleSaveProduct}
        mode={modalMode}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
}
