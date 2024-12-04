import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./Products.css";

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

function Products() {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "",
    barcode: "",
    stock: 0,
    username: localStorage.getItem("user"),
  });

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { username: localStorage.getItem("user") },
  });
  if (error) {
    console.error(
      "Detalles del error:",
      error.networkError || error.graphQLErrors
    );
  }
  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProduct({
        variables: {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
        },
      });
      setFormData({
        username: localStorage.getItem("user"),
        name: "",
        price: 0,
        category: "",
        barcode: "",
        stock: 0,
      });
      alert("Producto agregado con éxito.");
    } catch (err) {
      console.error("Error al agregar producto:", err);
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar productos: {error.message}</p>;

  return (
    <div className="products-container">
      <h1>Productos</h1>
      <div className="products-list">
        {data.products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p>Precio: ${product.price.toFixed(2)}</p>
            <p>Categoría: {product.category || "Sin categoría"}</p>
            <p>Stock: {product.stock}</p>
          </div>
        ))}
      </div>

      <div className="add-product-form">
        <h2>Agregar Nuevo Producto</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Categoría</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Código de Barras</label>
            <input
              type="text"
              name="barcode"
              value={formData.barcode}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Agregar Producto</button>
        </form>
      </div>
    </div>
  );
}

export default Products;
