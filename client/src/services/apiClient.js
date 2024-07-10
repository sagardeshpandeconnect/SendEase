// apiClient.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_API_URL // Replace with your actual backend URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const fetchFiles = async () => {
  try {
    const response = await axiosInstance.get("/files");
    return response.data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteFile = async (id) => {
  try {
    const response = await axiosInstance.delete(`/files/delete/${id}`);
    return response.data;
    console.log(response.data)
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const shareableUrl = (token) => `${BASE_URL}/files/share/${token}`;
