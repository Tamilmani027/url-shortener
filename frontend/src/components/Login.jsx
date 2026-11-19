import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../App.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../slices/authSlice";


const Login = () => {

  const navigate=useNavigate();
  const dispatch = useDispatch();
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

 const handleSubmit = async (values) => {
  try {
    const response = await axios.post("/login", values);
    const { user } = response.data;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.token) {
        localStorage.setItem("token", user.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      }
      dispatch(loginSuccess({ user, token: user.token }));
    }
    console.log(response.data);
    navigate('/dashboard')
    toast.success("Login successful!");
  } catch (error) {
    console.error(error.response?.data);
  }
};

  return (
    <div className="login-container">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="login-form">
          <h2>Login</h2>

          <div>
            <label>Email</label>
            <Field
              type="email"
              name="email"
              placeholder="Enter your email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="error"
            />
          </div>

          <div>
            <label>Password</label>
            <Field
              type="password"
              name="password"
              placeholder="Enter your password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="error"
            />
          </div>

          <button type="submit">Login</button>
					<Link to='/forgot-password'>Forgot Password ?</Link>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;
