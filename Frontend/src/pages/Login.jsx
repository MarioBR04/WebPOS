import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import "./Login.css"; // Archivo CSS para estilos

// Definir las mutaciones de login y register
const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      role: $role
    ) {
      id
      username
      email
      role
    }
  }
`;

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [isLogin, setIsLogin] = useState(true);

  // Configurar las mutaciones de login y register
  const [login, { data: loginData, loading: loginLoading, error: loginError }] =
    useMutation(LOGIN_MUTATION);
  const [
    register,
    { data: registerData, loading: registerLoading, error: registerError },
  ] = useMutation(REGISTER_MUTATION);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ variables: { username, password } });
      alert("Login successful:", username);
      localStorage.setItem("user", response.data.login);
      setUser(username);
    } catch (err) {
      alert("Login failed:", loginError);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register({
        variables: { username, email, password, role },
      });
      alert("Registration successful:", response.data.register);
    } catch (err) {
      alert("Registration failed:", err);
    }
    window.location.reload();
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Web POS</h1>
        <img src="/cashregister.png" alt="Logo" className="auth-logo" />
        {isLogin ? (
          <>
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="auth-input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="auth-button" type="submit">
                {loginLoading ? "Loading..." : "Login"}
              </button>
            </form>
            <p className="auth-footer">
              Don't have an account?{" "}
              <span onClick={toggleForm} className="auth-link">
                Register
              </span>
            </p>
            {loginError && <p className="auth-error">{loginError.message}</p>}
          </>
        ) : (
          <>
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="auth-input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="auth-input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="auth-input-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="auth-button" type="submit">
                {registerLoading ? "Loading..." : "Register"}
              </button>
            </form>
            <p className="auth-footer">
              Already have an account?{" "}
              <span onClick={toggleForm} className="auth-link">
                Login
              </span>
            </p>
            {registerError && (
              <p className="auth-error">{registerError.message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
