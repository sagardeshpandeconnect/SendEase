import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

function App() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); // State for modal visibility during upload
  const [deleting, setDeleting] = useState(false); // State for modal visibility during delete
  const [copyButtonText, setCopyButtonText] = useState("Copy"); // State for copy button text
  const fileInputRef = useRef(null); // Ref for input field

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3001/files");
      setFiles(response.data);
      console.log(response.data);
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
      setUploading(true); // Show modal (Please wait)
      await axios.post("http://localhost:3001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploading(false); // Hide modal (uploading complete)
      setFile(null); // Clear the file state
      fetchFiles(); // Refresh the list of uploaded files

      // Reset input field value programmatically
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setUploading(false); // Hide modal on error
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(true); // Show deleting modal
      await axios.delete(`http://localhost:3001/delete/${id}`);
      setDeleting(false); // Hide deleting modal
      fetchFiles(); // Refresh the list of uploaded files after deletion
    } catch (error) {
      setDeleting(false); // Hide modal on error
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  const shareableUrl = (token) => `http://localhost:3001/share/${token}`;

  const copyToClipboard = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopyButtonText("Copied!"); // Change button text to "Copied!"
    setTimeout(() => {
      setCopyButtonText("Copy"); // Reset button text after 2 seconds
    }, 2000);
  };

  function convertToIST(utcTimestamp) {
    // Create a Date object from the UTC timestamp
    const utcDate = new Date(utcTimestamp);

    // Get the UTC time in milliseconds since the Unix epoch
    const utcTime = utcDate.getTime();

    // IST is UTC + 5 hours 30 minutes (19800000 milliseconds)
    const istOffset = 11 * 60 * 60 * 1000;

    // Convert to IST by adding the offset
    const istTime = new Date(utcTime + istOffset);

    // Format the IST time as a string
    const istTimeString = istTime.toISOString().replace("T", " ").slice(0, 23);

    return istTimeString + " IST";
  }

  // const formattedTime = convertToIST(utcTimestamp);

  function formatFileSize(fileSizeInBytes) {
    const fileSizeInKB = fileSizeInBytes / 1024;
    if (fileSizeInKB < 1024) {
      return `${fileSizeInKB.toFixed(2)} KB`;
    } else {
      const fileSizeInMB = fileSizeInKB / 1024;
      return `${fileSizeInMB.toFixed(2)} MB`;
    }
  }

  return (
    <Box p={4}>
      <h1>File Upload</h1>
      <form onSubmit={handleUpload}>
        <FormControl>
          <Input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef} // Assign ref to input field
          />
        </FormControl>
        {file && <p>Selected file size: {formatFileSize(file.size)} </p>}

        <Button mt={4} colorScheme="teal" type="submit">
          Upload
        </Button>
      </form>
      <h1>Uploaded Files</h1>
      {files.map((file) => (
        <Box key={file.id} mt={4} borderWidth="1px" borderRadius="lg" p={4}>
          <Box>
            {file.filename} -
            <a
              href={`http://localhost:3001/download/${file.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download
            </a>
            <Button
              ml={2}
              colorScheme="red"
              onClick={() => handleDelete(file.id)}
            >
              Delete
            </Button>
            <br />
            Shareable Link:
            <Box display="flex" alignItems="center">
              <a
                href={shareableUrl(file.token)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {shareableUrl(file.token)}
              </a>
              <Button
                ml={2}
                colorScheme="blue"
                onClick={() => copyToClipboard(shareableUrl(file.token))}
              >
                {copyButtonText}
              </Button>
              <Text>{convertToIST(file.upload_time)}</Text>
              <Text>{formatFileSize(file.size)}</Text>
            </Box>
          </Box>
        </Box>
      ))}
      {/* Modal for "Please wait" during upload */}
      <Modal isOpen={uploading} onClose={() => setUploading(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please wait...</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Uploading file, please wait a moment...</ModalBody>
        </ModalContent>
      </Modal>
      {/* Modal for "Please wait" during delete */}
      <Modal isOpen={deleting} onClose={() => setDeleting(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please wait...</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Deleting file, please wait a moment...</ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;
