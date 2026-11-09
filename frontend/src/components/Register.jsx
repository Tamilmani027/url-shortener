import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import '../App.css';

const Register = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post('/register',values);

      console.log(response.data);
      alert("Registration Successful");
      resetForm();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="register-container">

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="register-form">
					<h2>Register</h2>
          <div>
            <label>First Name</label>
            <Field
              type="text"
              name="firstName"
              placeholder="Enter first name"
            />
            <ErrorMessage
              name="firstName"
              component="div"
              className="error"
            />
          </div>

          <div>
            <label>Last Name</label>
            <Field
              type="text"
              name="lastName"
              placeholder="Enter last name"
            />
            <ErrorMessage
              name="lastName"
              component="div"
              className="error"
            />
          </div>

          <div>
            <label>Email</label>
            <Field
              type="email"
              name="email"
              placeholder="Enter email"
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
              placeholder="Enter password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="error"
            />
          </div>

          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Register;