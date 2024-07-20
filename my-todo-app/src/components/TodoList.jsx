import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';

const TodoList = ({ token }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState('Pending');
  const [newWorkImage, setNewWorkImage] = useState(null);
  const [newDate, setNewDate] = useState(''); 

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data.data.works);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [token]);

  const handleAddTodo = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('todo', newTodo);
    formData.append('description', newDescription);
    formData.append('status', newStatus);
    formData.append('date', newDate);
    if (newWorkImage) {
      formData.append('workImage', newWorkImage);
    }

    try {
      await axios.post('http://localhost:8000/users/add-todo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          
        },
      });
      fetchTodos();
      setNewTodo('');
      setNewDescription('');
      setNewStatus('Pending');
      setNewWorkImage(null);
      setNewDate(''); // Clear the date field
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Loading todos...</p>;
  }

  if (error) {
    return <p>Error fetching todos: {error}</p>;
  }

  return (
    <div className="todo-list">
      <h2>Add New Todo</h2>
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="file"
          onChange={(e) => setNewWorkImage(e.target.files[0])}
        />
        <button type="submit">Add Todo</button>
      </form>

      {todos.length === 0 ? (
        <p>No todos available</p>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            token={token}
            fetchTodos={fetchTodos}
          />
        ))
      )}
    </div>
  );
};

export default TodoList;
