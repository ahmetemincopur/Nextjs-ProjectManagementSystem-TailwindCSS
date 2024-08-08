import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import Attachment from "./Attachment";
import SubTask from "./SubTask";
import Comment from "./Comment";
import Activity from "./Activity";

Modal.setAppElement("body");

const TaskDetails = ({ isOpen, onRequestClose, task, onDeleteTask }) => {
  const [activeTab, setActiveTab] = useState("comment");
  const [attachments, setAttachments] = useState(task ? task.attachments : []);
  const [comments, setComments] = useState(task ? task.comments : []);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!task) {
    return null;
  }

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setAttachments((prevAttachments) => [
      ...prevAttachments,
      ...newFiles.map((file) => ({
        id: Date.now() + file.name, // unique id for each file
        name: file.name,
        url: URL.createObjectURL(file), // create a temporary URL for the file
      })),
    ]);
  };

  const handleAddComment = (comment) => {
    setComments((prevComments) => [...prevComments, comment]);
  };

  const handleDeleteTask = async () => {
    try {
      const response = await axios.delete(
        `https://api.management.parse25proje.link/api/tasks/${task.code}`
      );
      if (response.status === 200) {
        console.log("Task deleted successfully:", response.data);

        onRequestClose(); // Close the modal on successful deletion
      } else {
        console.error("Failed to delete task:", response.data);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Task Details"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl mx-4">
        {/* Header with Close Button and Dropdown */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <nav className="flex space-x-2 text-sm text-gray-500">
              <a href="#" className="hover:underline">
                25 Proje
              </a>
              <span>/</span>
              <a href="#" className="hover:underline">
                Projects
              </a>
              <span>/</span>
              <span className="font-semibold text-gray-900">Frontend Case</span>
            </nav>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              ...
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                <button
                  onClick={handleDeleteTask}
                  className="block px-4 py-2 text-left text-gray-700 hover:bg-gray-100 w-full"
                >
                  Sil
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onRequestClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>

        <div className="flex">
          <div className="flex-grow p-6">
            {/* Task Date and Name */}
            <div className="mb-4 flex justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{task.name}</h2>
              <div className="text-gray-600 mt-1">
                <span>
                  {task.startDate}-{task.endDate}
                </span>
              </div>
            </div>

            {/* Task Info */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Task Status</p>
                <p className="text-gray-600">{task.status}</p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Assignment</p>
                <div className="flex items-center space-x-2">
                  {/* Example avatars */}
                  <img
                    src="https://via.placeholder.com/30"
                    alt="Assignee"
                    className="rounded-full w-8 h-8"
                  />
                  <img
                    src="https://via.placeholder.com/30"
                    alt="Assignee"
                    className="rounded-full w-8 h-8"
                  />
                  <span className="text-gray-600">+5</span>
                  <button className="text-gray-500 hover:text-gray-700">
                    +
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Priority</p>
                <span className="text-red-500">⚑</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="font-semibold text-gray-800 mb-2">Description</p>
              <p className="text-gray-600">{task.description}</p>
            </div>

            {/* Tab Navigation */}
            <div className="border-b mb-4">
              <nav className="flex space-x-4">
                <button
                  className={`py-2 px-4 ${
                    activeTab === "attachment"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("attachment")}
                >
                  Attachment
                </button>
                <button
                  className={`py-2 px-4 ${
                    activeTab === "subTask"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("subTask")}
                >
                  Sub Task
                </button>
                <button
                  className={`py-2 px-4 ${
                    activeTab === "comment"
                      ? "border-b-2 border-blue-500 text-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("comment")}
                >
                  Comment
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="max-h-64 overflow-y-auto">
              {activeTab === "attachment" && (
                <Attachment
                  attachments={attachments}
                  handleFileChange={handleFileChange}
                />
              )}

              {activeTab === "subTask" && <SubTask subTasks={task.subTasks} />}

              {activeTab === "comment" && (
                <Comment comments={comments} onAddComment={handleAddComment} />
              )}
            </div>
          </div>
          <div className="w-64 p-4">
            <Activity />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetails;
