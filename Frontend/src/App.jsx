import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./webBase/SideBar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import NewSale from "./pages/NewSale";
import CurrentSales from "./pages/CurrentSales";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import "./App.css";

export default function App() {
  const [user, setUser] = useState();

  if (!user && !localStorage.getItem("user")) {
    return <Login setUser={setUser} />;
  }
  return (
    <>
      <Router>
        <div className="root">
          <div className="navbar">
            <Navbar />
          </div>
          <div className="main">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/newsale" element={<NewSale />} />
              <Route path="/currentsales" element={<CurrentSales />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}
