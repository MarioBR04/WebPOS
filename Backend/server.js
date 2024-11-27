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
    user_id: ID!
    name: String!
    price: Float!
    description: String
    category: String
    barcode: String!
    image: String
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
    user_id: ID!
    customer_id: ID
    date: String!
    total: Float!
  }

  type SaleProduct {
    sale_id: ID!
    product_id: ID!
    quantity: Int!
    discount: Float
  }

  type Payment {
    id: ID!
    sale_id: ID!
    payment_method: String!
    amount: Float!
    date: String!
  }

  type Query {
    users: [User]
    products: [Product]
    customers: [Customer]
    sales: [Sale]
    payments: [Payment]
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
      user_id: ID!
      name: String!
      price: Float!
      description: String
      category: String
      barcode: String!
      image: String
      stock: Int!
    ): Product
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      const res = await client.query(
        "SELECT id, username, email, role FROM Users"
      );
      return res.rows;
    },
    products: async () => {
      const res = await client.query("SELECT * FROM Products");
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
    payments: async () => {
      const res = await client.query("SELECT * FROM Payments");
      return res.rows;
    },
  },
  Mutation: {
    register: async (_, { username, email, password, role }) => {
      const res = await client.query(
        "INSERT INTO Users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
        [username, email, password, role]
      );
      return res.rows[0];
    },
    login: async (_, { username, password }) => {
      const res = await client.query(
        "SELECT * FROM Users WHERE username = $1",
        [username]
      );
      if (res.rows.length === 0) {
        throw new Error("User not found");
      }
      const user = res.rows[0];
      const isPasswordValid = await (password == user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      } else {
        return username;
      }
    },
    addProduct: async (
      _,
      { user_id, name, price, description, category, barcode, image, stock }
    ) => {
      const res = await client.query(
        "INSERT INTO Products (user_id, name, price, description, category, barcode, image, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [user_id, name, price, description, category, barcode, image, stock]
      );
      return res.rows[0];
    },
  },
};

// Configurar Apollo Server
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
