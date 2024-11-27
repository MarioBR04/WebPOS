import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import Navbar from "./webBase/SideBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Contact";
import ProductDetails from "./pages/Services";
import Login from "./pages/Login";

export default function App() {
  const [user, setUser] = useState();

  /* if (!user && !localStorage.getItem("user")) {
  return <Login setUser={setUser} />;
} */

  return (
    <>
      <Router>
        <div className="root">
          <Navbar />
          <div className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}
