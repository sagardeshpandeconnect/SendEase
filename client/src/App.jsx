import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3001/files");
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
      setFile(null);
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/delete/${id}`);
      alert(response.data.message);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <h1>Uploaded Files</h1>
      {files.map((file) => (
        <div key={file.id}>
          <p>
            {file.filename} -{" "}
            <a
              href={`http://localhost:3001/download/${file.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
            <button onClick={() => handleDelete(file.id)}>Delete</button>
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
