import React from "react";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
      }
    ]
  },
     
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;