import React, { useEffect, useState } from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setError("");

      const response = await fetch("http://localhost:5000/api/todos");

      if (response.ok === false) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      setTodos(data);
    } catch (e) {
      setError("Could not load todos");
    }
  };

  const addTodo = async (title) => {
    try {
      setError("");

      const response = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: title })
      });

      if (response.ok === false) {
        throw new Error("Request failed");
      }

      const newTodo = await response.json();

      const newList = [newTodo, ...todos];
      setTodos(newList);
    } catch (e) {
      setError("Could not add todo");
    }
  };

  const toggleCompleted = async (id, completed) => {
    try {
      setError("");

      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: completed })
      });

      if (response.ok === false) {
        throw new Error("Request failed");
      }

      const updatedTodos = [];

      for (let i = 0; i < todos.length; i = i + 1) {
        const currentTodo = todos[i];

        if (currentTodo.id === id) {
          updatedTodos.push({
            id: currentTodo.id,
            title: currentTodo.title,
            completed: completed
          });
        } else {
          updatedTodos.push(currentTodo);
        }
      }

      setTodos(updatedTodos);
    } catch (e) {
      setError("Could not update todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError("");

      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "DELETE"
      });

      if (response.ok === false) {
        throw new Error("Request failed");
      }

      const remainingTodos = [];

      for (let i = 0; i < todos.length; i = i + 1) {
        const currentTodo = todos[i];

        if (currentTodo.id !== id) {
          remainingTodos.push(currentTodo);
        }
      }

      setTodos(remainingTodos);
    } catch (e) {
      setError("Could not delete todo");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>My To-Do App</h1>

      {error !== "" ? <p style={{ color: "red" }}>{error}</p> : null}

      <AddTodo onAdd={addTodo} />

      <TodoList todos={todos} onToggle={toggleCompleted} onDelete={deleteTodo} />
    </div>
  );
}

export default App;