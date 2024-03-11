import axios from "axios";
import { useState, useEffect } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");

  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:2000/todos");
      const todos = await response.json();
      setTodos(todos);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

  const handleAddTodo = async () => {
    if (inputText === "") {
      return alert("ga bisa kosong brok");
    }
    const response = await axios.post("http://localhost:2000/todos", {
      title: inputText,
      isDone: false,
    });
    setTodos([response.data, ...todos]);
    setInputText("");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2000/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleisDone = async (id, isDone) => {
    try {
      await axios.patch(`http://localhost:2000/todos/${id}`, {
        isDone: !isDone,
      });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, isDone: !isDone } : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  const doneCount = todos.filter((todo) => todo.isDone).length;

  return (
    <div>
      <h1>TodoList</h1>
      <div>
        {todos.map((todo) => {
          return (
            <div key={todo.id}>
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={() => handleisDone(todo.id, todo.isDone)}
              />
              <span
                style={{
                  textDecoration: todo.isDone ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </div>
          );
        })}
      </div>
      <div>
        <p>Done : {doneCount}</p>
      </div>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
    </div>
  );
};

export default TodoList;
