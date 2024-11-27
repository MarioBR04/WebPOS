import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./App.jsx";
import "./index.css";

// Configurar el cliente Apollo
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // URL de tu servidor GraphQL
  cache: new InMemoryCache(), // Manejo de cache en memoria
});

// Renderizar la aplicación con ApolloProvider
createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>
);
