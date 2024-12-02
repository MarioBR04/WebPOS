import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineClipboardList,
  HiOutlineChartBar,
  HiOutlineLogout,
  HiUserCircle,
  HiOutlineArchive,
} from "react-icons/hi";
import "./SideBar.css";

function Sidebar() {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Dashboard", icon: <HiOutlineHome /> },
    { to: "/products", label: "Productos", icon: <HiOutlineClipboardList /> },
    { to: "/newsale", label: "Nueva Venta", icon: <HiOutlineShoppingCart /> },
    {
      to: "/currentsales",
      label: "Ventas Activas",
      icon: <HiOutlineChartBar />,
    },
    {
      to: "/inventory",
      label: "Inventario",
      icon: <HiOutlineArchive />,
    },
  ];

  const logOut = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img className="logo" src="/cashregister.png" alt="Logo" />
        <span className="app-name">WebPOS</span>
      </div>
      <div className="sidebar-nav">
        <nav>
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`nav-item ${
                location.pathname === item.to ? "nav-active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="sidebar-footer">
        <div className="user-info">
          <HiUserCircle className="user-icon" />
          <p className="user-name">
            {localStorage.getItem("user") || "Usuario"}
          </p>
          <button className="logOut" onClick={logOut}>
            <span className="logout-text">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
