import React, { useState } from 'react';
import axios from 'axios';

const TodoItem = ({ todo, token, fetchTodos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState({ ...todo });

  const handleDelete = async () => {
    try {
      await axios.post('http://localhost:8000/users/delete-todo', todo,{
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.post('http://localhost:8000/users/update-todo', editedTodo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsEditing(false);
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
//   console.log(todo)

  return (
    <div className="todo-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTodo.todo}
            onChange={(e) => setEditedTodo({ ...editedTodo, todo: e.target.value })}
          />
          <input
            type="text"
            value={editedTodo.description}
            onChange={(e) => setEditedTodo({ ...editedTodo, description: e.target.value })}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{todo.todo}</h3>
          <p>{todo.description}</p>
          {todo.workImage && <img src={todo.workImage} alt="Work" style={{ maxWidth: '200px', maxHeight: '200px' }} />}
          <p><strong>Date:</strong> {new Date(todo.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {todo.status}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TodoItem;
