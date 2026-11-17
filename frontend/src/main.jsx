import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={3000} theme="light" />
  </StrictMode>,
)
