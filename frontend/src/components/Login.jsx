import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import '../App.css';


const Login = () => {
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
    const response = await api.post("/auth/login", values);
    console.log(response.data);
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
					<a>Forgot Password?</a>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;