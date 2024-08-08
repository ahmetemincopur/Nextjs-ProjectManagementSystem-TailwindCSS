import React, { useState } from "react";

const Comment = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment({
        id: Date.now(),
        user: "Current User",
        text: newComment,
        time: "Just now",
      });
      setNewComment("");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4 text-gray-900">
      {comments.map((comment) => (
        <div key={comment.id} className="mb-2">
          <div className="flex items-center mb-2">
            <img
              src={`https://via.placeholder.com/30?text=${comment.user[0]}`}
              alt={comment.user}
              className="rounded-full w-8 h-8 mr-2"
            />
            <p className="text-gray-600">
              <span className="font-semibold">{comment.user}</span> added a
              comment
            </p>
            <span className="ml-auto text-gray-500 text-xs">
              {comment.time}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{comment.text}</p>
        </div>
      ))}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Enter a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Comment;
