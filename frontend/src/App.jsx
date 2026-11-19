import React from "react";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import EmailActivation from "./components/EmailActivation";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ShortenUrl from "./components/ShortenUrl";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children:[
           {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path:'/dashboard',
        element:<Dashboard/>
      },
      {
        path:'/shorten',
        element:<ShortenUrl/>
      },
       {
        path:'/emailActivation',
        element:<EmailActivation/>
      },
      {
        path:'/emailActivation/:token',
        element:<EmailActivation/>
      },
      {
        path:'/forgot-password',
        element:<ForgotPassword/>
      },
      {
        path:'/reset-password/:token',
        element:<ResetPassword/>
      }
    ]
  },
     
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
