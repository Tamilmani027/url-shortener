import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Home = () => {
  const isLoggedIn = false;

  const handleLogout = () => {
  
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
            <button>Create Short URL</button>
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