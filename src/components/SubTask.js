import React from "react";

const SubTask = ({ subTasks }) => (
  <div>
    {subTasks && subTasks.length > 0 ? (
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        {subTasks.map((subTask) => (
          <div key={subTask.id} className="flex items-center mb-2">
            <p className="text-gray-600">{subTask.name}</p>
            <span className="ml-auto text-gray-500 text-xs">
              {subTask.dueDate}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg mb-4">
        <p className="text-gray-600 mb-2">No Sub Tasks</p>
      </div>
    )}
  </div>
);

export default SubTask;
