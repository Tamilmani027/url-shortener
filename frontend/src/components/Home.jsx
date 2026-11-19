import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../slices/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    dispatch(logout());
    navigate("/");
  };

  return (
		<>
    <div className="home-container">
      <h1>URL Shortener</h1>

      {!isLoggedIn ? (
        <>

          <div className="auth-buttons">
            <Link to="/login">
              <button>Login</button>
            </Link>

            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <h2>Welcome Back</h2>

          <div className="dashboard-actions">
            <button onClick={() => navigate('/shorten')}>Create Short URL</button>
            <button>My URLs</button>
            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
		<Outlet/>
		</>
  );
};

export default Home;