import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store from './store/ReduxStore'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </Provider>
  </StrictMode>,
)
