import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import "./Products.css";

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      username
      name
      price
      description
      category
      barcode
      stock
      image
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct(
    $username: String!
    $name: String!
    $price: Float!
    $description: String
    $category: String
    $barcode: String!
    $image: String
    $stock: Int!
  ) {
    addProduct(
      username: $username
      name: $name
      price: $price
      description: $description
      category: $category
      barcode: $barcode
      image: $image
      stock: $stock
    ) {
      id
      name
      price
      stock
      image
    }
  }
`;

function Products() {
  const [formData, setFormData] = useState({
    username: localStorage.getItem("user"),
    name: "",
    price: 0,
    description: "",
    category: "",
    barcode: "",
    stock: 0,
    image: null, // Agregamos imagen
  });

  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result }); // Base64
    };
    if (file) {
      reader.readAsDataURL(file);
    }
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
        description: "",
        category: "",
        barcode: "",
        stock: 0,
        image: null,
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
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
            )}
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
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
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
          <div>
            <label>Imagen</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button type="submit">Agregar Producto</button>
        </form>
      </div>
    </div>
  );
}

export default Products;
