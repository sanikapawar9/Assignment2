import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Pagination, Button } from "react-bootstrap";

const TodoTable = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    completed: false,
    userId: 1,
  });
  const [editTodo, setEditTodo] = useState({
    id: null,
    title: "",
    completed: "",
  });

  // for pagination purpose
  const [currentPage, setCurrentPage] = useState(1);
  const [todosPerPage] = useState(10);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos");
        setTodos(response.data);
      } 
      catch (error) {
        console.error("There was an error fetching the todos", error);
      }
    };
    fetchTodos();
  }, []);

  
  const createTodo = async () => {
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/todos", newTodo);
      setTodos([...todos, response.data]);
      setNewTodo({ title: "", completed: false, userId: 1 });
    } 
    catch (error) {
      console.error("Error creating todo", error);
    }
  };


  const startEditTodo = (todo) => {
    setEditTodo(todo);
  };

  const saveEditTodo = async () => {
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${editTodo.id}`,editTodo);
      const updatedTodos = todos.map((todo) =>
        todo.id === editTodo.id ? response.data : todo
      );
      setTodos(updatedTodos);
      setEditTodo({ id: null, title: "", completed: "" });
    } 
    catch (error) {
      console.error("Error updating todo", error);
    }
  };


  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } 
    catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  
  // current todos
  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculating page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr className="text-center">
            <th>ID</th>
            <th>Title</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
              <td>{todo.completed ? "Yes" : "No"}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => startEditTodo(todo)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteTodo(todo.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Create new</h2>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newTodo.title}
          onChange={(event) =>
            setNewTodo({ ...newTodo, title: event.target.value })
          }
        />
        <select
          value={String(newTodo.completed)}
          onChange={(event) =>
            setNewTodo({
              ...newTodo,
              completed: event.target.value === "true",
            })
          }
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <Button onClick={createTodo} className="m-2" variant="success" size="sm">
          Create Todo
        </Button>
      </div>
      {editTodo.id !== null && (
        <div>
          <h2>Edit Todo</h2>
          <input
            type="text"
            placeholder="Title"
            value={editTodo.title}
            onChange={(event) =>
              setEditTodo({
                ...editTodo,
                title: event.target.value,
              })
            }
          />
          <select
            value={String(editTodo.completed)}
            onChange={(event) =>
              setEditTodo({
                ...editTodo,
                completed: event.target.value === "true",
              })
            }
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
          <button onClick={saveEditTodo}>Save Changes</button>
        </div>
      )}
      <div className="d-flex justify-content-center">
        <Pagination>
          {pageNumbers.map((number) => (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => paginate(number)}
            >
              {number}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </>
  );
};

export default TodoTable;
