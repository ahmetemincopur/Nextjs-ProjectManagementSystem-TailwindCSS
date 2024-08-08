import React, { useState } from "react";
import { useDrag } from "react-dnd";
import axios from "axios";

export default function Task({ task, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: {
      id: task.id,
      boardId: task.boardId,
      name: task.name,
      description: task.description,
      startDate: task.startDate,
      endDate: task.endDate,
      flagId: task.flagId,
      code: task.code,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const flagColors = {
    1: "#C80B0B", // High Priority
    2: "#F79009", // Medium Priority
    3: "#B3B8DB", // Low Priority
    4: "#2083D7", // Standard Priority
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleUpdateTask = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.put(
        `https://api.management.parse25proje.link/api/tasks/${task.code}`,
        updatedTask
      );
      if (response.status === 200) {
        onUpdate(response.data.data);
        setIsEditing(false);
      } else {
        console.error("Failed to update task:", response.data);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div
      ref={drag}
      className={`mb-4 p-4 bg-gray-100 rounded-lg ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {isEditing ? (
        <form onSubmit={handleUpdateTask}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={updatedTask.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={updatedTask.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={updatedTask.startDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={updatedTask.endDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Priority
            </label>
            <select
              name="flagId"
              value={updatedTask.flagId}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="1">High Priority</option>
              <option value="2">Medium Priority</option>
              <option value="3">Low Priority</option>
              <option value="4">Standard Priority</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(false);
              }}
              className="ml-2 text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div className="text-sm font-bold text-red-500 mb-2">
              {task.name}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-xs text-blue-500 hover:underline"
            >
              Update
            </button>
          </div>
          <div className="text-sm mb-2">
            {task.description ? task.description : "No description provided"}
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.06177 5.76953H12.9444"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.96143 8.37305H9.9676"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.00305 8.37305H7.00923"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.03857 8.37305H4.04475"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.96143 10.9641H9.9676"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.00305 10.9641H7.00923"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.03857 10.9641H4.04475"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.6958 0.833252V3.02711"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.3103 0.833252V3.02711"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.82551 1.88599L4.18064 1.88599C2.22285 1.88599 1 2.97661 1 4.98134L1 11.0144C1 13.0507 2.22285 14.1665 4.18064 14.1665H9.81933C11.7833 14.1665 13 13.0696 13 11.0649V4.98134C13.0062 2.97661 11.7895 1.88599 9.82551 1.88599Z"
                stroke="#98A2B3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-1 mb-2">
              {task.startDate ? task.startDate : "No start date provided"} -{" "}
              {task.endDate ? task.endDate : "No end date provided"}
            </span>
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <svg
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.707107"
                y="5.5"
                width="6.07107"
                height="6.07107"
                transform="rotate(-45 0.707107 5.5)"
                stroke="#98A2B3"
              />
              <rect
                x="0.707107"
                y="5.5"
                width="6.07107"
                height="6.07107"
                transform="rotate(-45 0.707107 5.5)"
                stroke="#98A2B3"
              />
            </svg>
            <span className="ml-1">
              {task.milestone ? task.milestone : "No milestone provided"}
            </span>
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.6191 8.05667L13.2878 4.90133C13.3698 4.746 13.3644 4.55933 13.2738 4.40933C13.1838 4.25933 13.0211 4.16733 12.8458 4.16733H8.45711V3.26C8.45711 2.984 8.23311 2.76 7.95711 2.76H3.65442V2.5C3.65442 2.224 3.43042 2 3.15442 2C2.87842 2 2.65442 2.224 2.65442 2.5V14.5C2.65442 14.776 2.87842 15 3.15442 15C3.43042 15 3.65442 14.776 3.65442 14.5V10.578L7.45844 10.484V11.498C7.45844 11.6327 7.51311 11.762 7.60911 11.856C7.70511 11.95 7.81044 11.998 7.97044 11.998L12.8578 11.8787C13.0318 11.8747 13.1904 11.78 13.2778 11.6293C13.3651 11.4793 13.3684 11.294 13.2858 11.1413L11.6191 8.05667Z"
                fill={flagColors[task.flagId] || "#98A2B3"}
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
