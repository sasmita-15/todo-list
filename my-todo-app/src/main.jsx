import React from 'react';
import ReactDOM from 'react-dom/client'; // Note the change here
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Note the change here
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
