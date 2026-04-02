window.onerror = function(msg, src, line, col, err) {
  document.body.innerHTML = `<div style="color:white;padding:20px;background:#140817;font-family:monospace;font-size:12px">
    <h2>Erreur Safari</h2>
    <p>${msg}</p>
    <p>Ligne: ${line}</p>
    <p>${err?.stack || ''}</p>
  </div>`;
};

window.onunhandledrejection = function(e) {
  document.body.innerHTML = `<div style="color:white;padding:20px;background:#140817;font-family:monospace;font-size:12px">
    <h2>Erreur Promise</h2>
    <p>${e.reason}</p>
  </div>`;
};

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
