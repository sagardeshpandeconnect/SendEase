import { useState, useRef, useCallback } from "react";
import { fetchFiles, uploadFile, deleteFile } from "../services/apiClient";

export const useFileHandling = (BASE_URL) => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = useCallback(async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      setUploading(true);

      // Using FormData to upload the file
      const formData = new FormData();
      formData.append("file", file);

      // Call the uploadFile function from apiClient
      await uploadFile(formData);

      // Reset state after successful upload
      setUploading(false);
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Fetch and update files list
      const sortedFiles = await fetchFiles();
      setFiles(sortedFiles);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
      alert(`Error uploading file: ${error.message}`);
    }
  }, [file]);

  const handleDelete = useCallback(async (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));

    try {
      setDeleting(true);
      await deleteFile(id);
      setDeleting(false);

      const sortedFiles = await fetchFiles();
      setFiles(sortedFiles);
    } catch (error) {
      console.error("Error deleting file:", error);
      setDeleting(false);
      alert(`Error deleting file: ${error.message}`);
    }
  }, []);

  return {
    files,
    file,
    uploading,
    deleting,
    uploadProgress,
    setFile,
    setFiles,
    handleFileChange,
    handleUpload,
    handleDelete,
    fileInputRef,
  };
};
