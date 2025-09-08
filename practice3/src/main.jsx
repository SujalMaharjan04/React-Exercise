import './index.css'
import ReactDOM from 'react-dom/client'
import App from './App'
import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams,
  useNavigate,
  Navigate,
  useMatch
} from 'react-router-dom'





ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
)