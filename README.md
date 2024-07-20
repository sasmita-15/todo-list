# Todo List Application

## Overview

This Todo List application allows users to register, log in, manage their todos, and view their list of tasks. The application consists of a backend built with Node.js, Express, and MongoDB, and a frontend built with React. The backend includes API endpoints for user management and todo management, while the frontend provides an interface for interacting with these APIs.

## Features

- **User Authentication**: Register, login, and logout users.
- **User Authorization**: User can only update own list.
- **Todo Management**: Add, update, and delete todos.
- **Todo List**: View all todos associated with a user.

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Node.js, Express, MongoDB
- **Testing**: Mocha, Chai, Chai-HTTP
- **API Documentation**: Swagger

## Setup and Installation

### Backend

1. **Clone the repository**

   ```bash
   git clone https://github.com/Suryanshu15/todoList
   ```

2. **Navigate to the backend directory**

   ```bash
   cd todolist/backend
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory with the following content:

   ```env
   MONGODB_URI=mongodb://localhost:27017/todolist
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Run the backend server**

   ```bash
   npm run dev
   ```

   The server will be running at `http://localhost:8000`.



### Running Tests

1. **Navigate to the backend directory**

   ```bash
   cd backend
   ```

2. **Run tests**

   ```bash
   npm test
   ```

## API Documentation

The API documentation is available at `http://localhost:8000/api-docs` after running the backend server.

## Endpoints

### User Endpoints

- **POST** `/users/register` - Register a new user
- **POST** `/users/login` - Log in a user
- **POST** `/users/logout` - Log out a user

### Todo Endpoints

- **POST** `/users/add-todo` - Add a new todo
- **POST** `/users/update-todo` - Update an existing todo
- **POST** `/users/delete-todo` - Delete a todo
- **GET** `/users/todos` - Get all todos for the logged-in user