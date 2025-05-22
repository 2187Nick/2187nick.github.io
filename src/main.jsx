import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add immediate logging
console.warn('Main.jsx is executing');
window.addEventListener('DOMContentLoaded', () => {
    console.error('DOM Content Loaded');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
