import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaFileDownload, FaPlus, FaTasks } from "react-icons/fa";
import "./App.css"; 

const apiUrl = process.env.REACT_APP_API_URL;

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const fetchTasks = async () => {
    const res = await axios.get(`${apiUrl}/api/tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("taskName", taskName);
    formData.append("description", description);
    if (file) formData.append("file", file);

    await axios.post(`${apiUrl}/api/tasks`, formData);
    fetchTasks();
    setTaskName("");
    setDescription("");
    setFile(null);
  };

  const handleDelete = async (taskId) => {
    await axios.delete(`http://54.87.130.80:9000/api/tasks/${taskId}`);
    fetchTasks();
  };

  return (
    <div className="app-container">
      <div className="background-circles">
        <div className="circle blue" />
        <div className="circle purple" />
      </div>

      <div className="glass-card">
      <h1><FaTasks /> Task Manager</h1>

        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button className="submit-btn" type="submit">
            <FaPlus /> Add Task
          </button>
        </form>

        <h2>📋 Tasks</h2>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.taskId} className="task-item">
              <div>
                <strong>{task.taskName}</strong> - {task.description}{" "}
                {task.fileUrl && (
                  <a
                    href={task.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFileDownload />
                  </a>
                )}
              </div>
              <button
                onClick={() => handleDelete(task.taskId)}
                className="delete-btn"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
