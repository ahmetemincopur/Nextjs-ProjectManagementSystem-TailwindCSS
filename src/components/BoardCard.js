import { useState } from "react";
import { useDrop } from "react-dnd";
import axios from "axios";
import Task from "./Task";
import TaskDetails from "./TaskDetails";

const priorities = [
  { id: 1, name: "High Priority", color: "#C80B0B", priority: 1 },
  { id: 2, name: "Medium Priority", color: "#F79009", priority: 2 },
  { id: 3, name: "Low Priority", color: "#B3B8DB", priority: 3 },
  { id: 4, name: "Standard Priority", color: "#2083D7", priority: 4 },
];

export default function BoardCard({ board, onAddTask, onMoveTask }) {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    flagId: 1,
    boardId: board.id,
  });

  const handleNewTaskToggle = () => {
    setShowNewTaskForm(!showNewTaskForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleAddTaskClick = async () => {
    try {
      const response = await axios.post(
        "https://api.management.parse25proje.link/api/tasks",
        newTask
      );
      if (response.status === 201) {
        onAddTask(board.id, response.data.data);
        setShowNewTaskForm(false);
        setNewTask({
          name: "",
          description: "",
          startDate: "",
          endDate: "",
          flagId: 1,
          boardId: board.id,
        });
      }
    } catch (error) {
      console.error("Failed to add task", error);
    }
  };

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      onMoveTask(
        item.name,
        item.description,
        board.id,
        item.flagId,
        item.startDate,
        item.endDate,
        item.code
      );
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  return (
    <div
      ref={drop}
      className={`relative bg-white p-4 rounded-lg shadow-md w-1/3 text-gray-800 h-full overflow-hidden min-w-72 ${
        isOver ? "bg-blue-100" : ""
      }`}
    >
      <div className="flex justify-between align-middle">
        <h2 className="text-xl font-bold mb-4">{board.name}</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleNewTaskToggle}
            className="text-blue-500 hover:underline mb-4"
          >
            +
          </button>
        </div>
      </div>

      <div className="h-board-normal-size overflow-y-auto mt-2">
        {showNewTaskForm && (
          <div className="p-4 bg-gray-200 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Add New Task
            </h3>
            <input
              type="text"
              name="name"
              value={newTask.name}
              onChange={handleInputChange}
              placeholder="Task Name"
              className="w-full p-2 mt-2 mb-2 border rounded text-gray-800"
            />
            <textarea
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full p-2 mb-2 border rounded text-gray-800"
            ></textarea>
            <input
              type="date"
              name="startDate"
              value={newTask.startDate}
              onChange={handleInputChange}
              placeholder="Start Date"
              className="w-full p-2 mb-2 border rounded text-gray-800"
            />
            <input
              type="date"
              name="endDate"
              value={newTask.endDate}
              onChange={handleInputChange}
              placeholder="End Date"
              className="w-full p-2 mb-2 border rounded text-gray-800"
            />
            <select
              name="flagId"
              value={newTask.flagId}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded text-gray-800"
            >
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              <button
                onClick={handleAddTaskClick}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={handleNewTaskToggle}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showNewTaskForm && board.tasks.length === 0 && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded shadow-md cursor-pointer"
            onClick={handleNewTaskToggle}
          >
            New Task
          </div>
        )}

        {board.tasks.length > 0 &&
          board.tasks.map((task) => (
            <div key={task.id} onClick={() => handleTaskClick(task)}>
              <Task task={task} onUpdate={onMoveTask} />
            </div>
          ))}
      </div>
      <TaskDetails
        isOpen={selectedTask !== null}
        onRequestClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
}
