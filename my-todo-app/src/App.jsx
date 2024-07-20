import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TodoList from './components/TodoList';
import Signup from './components/Signup';
import Login from './components/Login';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleSetToken = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Todo List</h1>
          {token && <button onClick={handleLogout}>Logout</button>}
        </header>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/" /> : <Login setToken={handleSetToken} />}
          />
          <Route
            path="/"
            element={token ? <TodoList token={token} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
