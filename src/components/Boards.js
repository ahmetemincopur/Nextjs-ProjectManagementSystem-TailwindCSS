import { useState, useEffect } from "react";
import axios from "axios";
import BoardCard from "./BoardCard";
import TaskDetails from "./TaskDetails"; // Ensure to import TaskDetails
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Boards");
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        console.log("Fetching boards...");
        const response = await axios.get(
          "https://api.management.parse25proje.link/api/boards"
        );
        console.log("Boards fetched successfully:", response.data.data);
        setBoards(response.data.data);
        setFilteredBoards(response.data.data);
      } catch (error) {
        console.error("Failed to fetch boards", error);
      }
    };
    fetchBoards();
  }, []);

  const handleFilterBoards = () => {
    const filtered = boards.filter((board) =>
      board.name.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredBoards(filtered);
  };

  const handleAddTask = (boardId, newTask) => {
    console.log(`Adding new task to board ${boardId}`, newTask);
    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? { ...board, tasks: [newTask, ...board.tasks] }
          : board
      )
    );
    setFilteredBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? { ...board, tasks: [newTask, ...board.tasks] }
          : board
      )
    );
  };

  const handleMoveTask = async (
    name,
    description,
    newBoardId,
    flagId,
    startDate,
    endDate,
    code
  ) => {
    try {
      console.log(`Attempting to move task to board ${newBoardId}`);
      const payload = {
        name,
        description,
        boardId: newBoardId,
        flagId,
        startDate,
        endDate,
      };
      console.log("Payload for POST request:", payload);

      const response = await axios.post(
        "https://api.management.parse25proje.link/api/tasks",
        payload
      );
      console.log("POST response:", response);

      if (response.status === 201) {
        const newTask = response.data.data;

        setBoards((prevBoards) => {
          const updatedBoards = prevBoards.map((board) => {
            if (board.id === newBoardId) {
              return {
                ...board,
                tasks: [newTask, ...board.tasks],
              };
            } else {
              return {
                ...board,
                tasks: board.tasks.filter((task) => task.name !== name),
              };
            }
          });
          return updatedBoards;
        });

        setFilteredBoards((prevBoards) => {
          const updatedBoards = prevBoards.map((board) => {
            if (board.id === newBoardId) {
              return {
                ...board,
                tasks: [newTask, ...board.tasks],
              };
            } else {
              return {
                ...board,
                tasks: board.tasks.filter((task) => task.name !== name),
              };
            }
          });
          return updatedBoards;
        });

        // Delete the task from the original board
        const deleteResponse = await axios.delete(
          `https://api.management.parse25proje.link/api/tasks/${code}`
        );
        console.log("DELETE response:", deleteResponse);
      } else {
        console.error(
          "Failed to create new task on the new board. Status:",
          response.status
        );
        console.log("Response data:", response.data);
      }
    } catch (error) {
      console.error("Failed to move task", error);
    }
  };

  const handleDeleteTask = async (code) => {
    try {
      console.log(`Deleting task with id ${code}`);
      const response = await axios.delete(
        `https://api.management.parse25proje.link/api/tasks/${code}`
      );
      console.log("DELETE response:", response);

      if (response.status === 200) {
        setBoards((prevBoards) =>
          prevBoards.map((board) => ({
            ...board,
            tasks: board.tasks.filter((task) => task.code !== code),
          }))
        );
        setFilteredBoards((prevBoards) =>
          prevBoards.map((board) => ({
            ...board,
            tasks: board.tasks.filter((task) => task.code !== code),
          }))
        );
      } else {
        console.error("Failed to delete task. Status:", response.status);
      }
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleAddBoard = () => {
    const boardName = prompt("Enter board name:");
    if (boardName) {
      const newBoard = { id: Date.now(), name: boardName, tasks: [] };
      console.log("Adding new board:", newBoard);
      setBoards((prevBoards) => [...prevBoards, newBoard]);
      setFilteredBoards((prevBoards) => [...prevBoards, newBoard]);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Frontend Case</h1>
          <div className="flex items-center space-x-2">
            <button onClick={() => setFilterVisible(!filterVisible)}>
              <svg
                width="20"
                height="24"
                viewBox="0 0 20 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.66675 5.83333C1.66675 5.36662 1.66675 5.13327 1.75758 4.95501C1.83747 4.79821 1.96495 4.67072 2.12176 4.59083C2.30002 4.5 2.53337 4.5 3.00008 4.5H17.0001C17.4668 4.5 17.7001 4.5 17.8784 4.59083C18.0352 4.67072 18.1627 4.79821 18.2426 4.95501C18.3334 5.13327 18.3334 5.36662 18.3334 5.83333V6.39116C18.3334 6.61516 18.3334 6.72716 18.306 6.8313C18.2818 6.92359 18.2419 7.01103 18.188 7.0898C18.1272 7.17869 18.0426 7.25204 17.8733 7.39875L12.5435 12.0179C12.3742 12.1646 12.2896 12.238 12.2288 12.3269C12.175 12.4056 12.135 12.4931 12.1108 12.5854C12.0834 12.6895 12.0834 12.8015 12.0834 13.0255V17.382C12.0834 17.5449 12.0834 17.6264 12.0571 17.6969C12.0339 17.7591 11.9961 17.8149 11.947 17.8596C11.8913 17.9102 11.8157 17.9404 11.6643 18.001L8.83101 19.1343C8.52472 19.2568 8.37158 19.3181 8.24864 19.2925C8.14114 19.2702 8.04679 19.2063 7.98612 19.1148C7.91675 19.0101 7.91675 18.8452 7.91675 18.5153V13.0255C7.91675 12.8015 7.91675 12.6895 7.88938 12.5854C7.86512 12.4931 7.82519 12.4056 7.77134 12.3269C7.71056 12.238 7.62593 12.1646 7.45666 12.0179L2.12684 7.39875C1.95757 7.25204 1.87293 7.17869 1.81216 7.0898C1.7583 7.01103 1.71838 6.92359 1.69412 6.8313C1.66675 6.72716 1.66675 6.61516 1.66675 6.39116V5.83333Z"
                  stroke="#98A2B3"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {filterVisible && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md text-gray-900">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Filter Boards
            </h2>
            <input
              type="text"
              placeholder="Filter by board name"
              className="w-full p-2 border rounded-lg"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={handleFilterBoards}
            >
              Apply Filter
            </button>
          </div>
        )}
        <div className="flex space-x-4 mb-8">
          {[
            "Boards",
            "List",
            "Other1",
            "Other2",
            "Other3",
            "Other4",
            "Other5",
          ].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 ${
                selectedTab === tab ? "text-blue-600 font-bold" : "text-black"
              } bg-gray-100 rounded`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex space-x-4 overflow-x-auto">
          {filteredBoards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onAddTask={handleAddTask}
              onMoveTask={handleMoveTask}
              onTaskClick={handleTaskClick} // Pass the function to handle task clicks
            />
          ))}
          <div
            className="bg-white p-4 rounded-lg shadow-md w-1/3 text-gray-800 flex items-center justify-center cursor-pointer"
            onClick={handleAddBoard}
          >
            <button className="text-blue-500 hover:underline">Add Board</button>
          </div>
        </div>
        {selectedTask && (
          <TaskDetails
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            task={selectedTask}
            onDeleteTask={handleDeleteTask} // Pass the delete handler
          />
        )}
      </div>
    </DndProvider>
  );
}
