import React from "react";

const Attachment = ({ attachments, handleFileChange }) => (
  <div>
    {attachments && attachments.length > 0 ? (
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center mb-2">
            <img
              src={attachment.url}
              alt="Attachment Icon"
              className="w-6 h-6 mr-2"
            />
            <p className="text-gray-600">{attachment.name}</p>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center bg-gray-100 p-4 rounded-lg mb-4">
        <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
        <p className="text-gray-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 cursor-pointer"
        >
          Upload Files
        </label>
      </div>
    )}
  </div>
);

export default Attachment;
