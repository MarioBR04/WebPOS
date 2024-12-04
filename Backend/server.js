const client = require("./db/db.js");
const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Product {
    id: ID!
    username: String!
    name: String!
    price: Float!
    category: String
    barcode: String!
    stock: Int!
  }

  type Customer {
    id: ID!
    name: String!
    email: String
    phone: String
  }

  type Sale {
    id: ID!
    username: String
    customer_id: ID
    date: String!
    total: Float
    payment: String!
  }

  type SaleProduct {
    sale_id: Int!
    product_id: Int!
    quantity: Int!
    discount: Float
    name: String
  }

  type Query {
    users: [User]
    products(username: String!): [Product]
    customers: [Customer]
    sales: [Sale]
    lastSales(username: String!): [Sale]
    saleProducts(saleId: Int!): [SaleProduct]
  }

  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      role: String!
    ): User
    login(username: String!, password: String!): String
    addProduct(
      username: String!
      name: String!
      price: Float!
      category: String
      barcode: String!
      stock: Int!
    ): Product!
    editProduct(
      id: ID!
      name: String
      price: Float
      category: String
      barcode: String
      stock: Int
      username: String
    ): Product
    deleteProduct(id: ID!): Boolean
    newSale(username: String!, total: Float!, payment: String!): Sale
    newSaleProducts(saleId: Int!, productId: Int!, quantity: Int!): SaleProduct
  }
`;

const resolvers = {
  Query: {
    lastSales: async (_, { username }) => {
      if (!username)
        throw new Error(
          "Con que pudiste entrar sin iniciar sesión ehh, pillado"
        );
      const res = await client.query(
        "SELECT id, username, total, payment, date FROM Sales WHERE username = $1 ORDER BY date",
        [username]
      );
      return res.rows;
    },
    users: async () => {
      const res = await client.query(
        "SELECT id, username, email, role FROM Users"
      );
      return res.rows;
    },
    products: async (_, { username }) => {
      if (!username)
        throw new Error(
          "Con que pudiste entrar sin iniciar sesión ehh, pillado"
        );
      const res = await client.query(
        "SELECT * FROM Products where username = $1 ORDER BY barcode",
        [username]
      );
      return res.rows;
    },
    customers: async () => {
      const res = await client.query("SELECT * FROM Customers");
      return res.rows;
    },
    sales: async () => {
      const res = await client.query("SELECT * FROM Sales");
      return res.rows;
    },
    saleProducts: async (_, { saleId }) => {
      if (!saleId || saleId <= 0) throw new Error("No existe esa venta.");
      console.log(saleId);
      const res = await client.query(
        "SELECT * FROM Sales_Products WHERE sale_id = $1",
        [parseInt(saleId, 10)]
      );
      const name = await client.query(
        "SELECT name FROM Products WHERE id = $1",
        [res.rows[0].product_id]
      );
      res.rows[0].name = name.rows[0].name;
      return res.rows;
    },
  },
  Mutation: {
    register: async (_, { username, email, password, role }) => {
      if (!username || !email || !password || !role) {
        throw new Error("All fields are required.");
      }
      const existingUser = await client.query(
        "SELECT * FROM Users WHERE username = $1 OR email = $2",
        [username, email]
      );
      if (existingUser.rows.length > 0) {
        throw new Error("Ya existe el usuario o el correo.");
      }
      const res = await client.query(
        "INSERT INTO Users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
        [username, email, password, role]
      );
      return res.rows[0];
    },
    login: async (_, { username, password }) => {
      if (!username || !password) {
        throw new Error("Te hace falta o la contraseña o el usuario.");
      }
      const res = await client.query(
        "SELECT * FROM Users WHERE username = $1",
        [username]
      );
      if (res.rows.length === 0) {
        throw new Error("El usuario no existe");
      }
      const user = res.rows[0];
      if (password !== user.password) {
        throw new Error("Uy uy uy, la contraseña no es correcta.");
      }
      return username;
    },
    addProduct: async (
      _,
      { username, name, price, category, barcode, stock }
    ) => {
      if (!username || !name || price <= 0 || stock < 0) {
        throw new Error("No vas a tronar la pagina.");
      }
      const existingProduct = await client.query(
        "SELECT * FROM Products WHERE barcode = $1",
        [barcode]
      );
      if (existingProduct.rows.length > 0) {
        throw new Error("Ya esta ocupado ese codigo.");
      }
      const res = await client.query(
        "INSERT INTO Products (username, name, price, category, barcode, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [username, name, price, category, barcode, stock]
      );
      return res.rows[0];
    },
    editProduct: async (_, { id, name, price, category, barcode, stock }) => {
      if (!id || price < 0 || stock < 0) {
        throw new Error("No no no, no puedes hacer eso.");
      }
      const product = await client.query(
        "UPDATE Products SET name = $1, price = $2, category = $3, barcode = $4, stock = $5 WHERE id = $6 RETURNING *",
        [name, price, category, barcode, stock, id]
      );
      if (!product.rows[0]) {
        throw new Error("No encontre el producto, perdoname.");
      }
      return product.rows[0];
    },
    deleteProduct: async (_, { id }) => {
      if (!id) throw new Error("Hey, el id no puede ser vacio.");
      const product = await client.query(
        "DELETE FROM Products WHERE id = $1 RETURNING id",
        [id]
      );
      if (!product.rows[0]) {
        throw new Error("Uy, no encontre el producto.");
      }
      return true;
    },
    newSale: async (_, { username, total, payment }) => {
      if (!username || total <= 0 || !payment) {
        throw new Error("NOOOOOOO, informacion incorrecta.");
      }
      const res = await client.query(
        "INSERT INTO Sales (username, total, payment) VALUES ($1, $2, $3) RETURNING *",
        [username, total, payment]
      );
      return res.rows[0];
    },
    newSaleProducts: async (_, { saleId, productId, quantity }) => {
      if (saleId <= 0 || productId <= 0 || quantity <= 0) {
        throw new Error("Informacion incorrecta.");
      }
      const res = await client.query(
        "INSERT INTO Sales_Products (sale_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING sale_id, product_id, quantity",
        [saleId, productId, quantity]
      );
      return res.rows[0];
    },
  },
};

async function startServer() {
  const app = express();
  app.use(cors());
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}
startServer();
