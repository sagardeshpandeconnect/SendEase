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
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  ArrowUpIcon,
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
} from "@chakra-ui/icons";

function App() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); // State for modal visibility during upload
  const [deleting, setDeleting] = useState(false); // State for modal visibility during delete
  const [copyButtonText, setCopyButtonText] = useState(
    <Button
      leftIcon={<CopyIcon />}
      colorScheme="blue"
      variant="solid"
      size="sm"
    >
      Copy Link
    </Button>
  ); // State for copy button text
  const fileInputRef = useRef(null); // Ref for input field

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://192.168.1.100:3001/files");
      const sortedFiles = response.data.sort(
        (a, b) => new Date(b.upload_time) - new Date(a.upload_time)
      );
      setFiles(sortedFiles);
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
      await axios.post("http://192.168.1.100:3001/files/upload", formData, {
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
    // Optimistic UI update: Remove file from state immediately
    setFiles((files) => files.filter((file) => file.id !== id));

    try {
      setDeleting(true); // Show deleting modal

      // Simulate a delay before actually deleting from server
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust delay as needed

      // Now perform the actual delete request
      await axios.delete(`http://192.168.1.100:3001/files/delete/${id}`);

      setDeleting(false); // Hide deleting modal
      // Refresh the list of uploaded files after deletion
      fetchFiles();
    } catch (error) {
      setDeleting(false); // Hide modal on error
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };

  const shareableUrl = (token) => `http://localhost:3001/files/share/${token}`;

  const copyToClipboard = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopyButtonText(
      <Button colorScheme="blue" variant="solid" size="sm">
        Copied
      </Button>
    ); // Change button text to "Copied!"
    setTimeout(() => {
      setCopyButtonText(
        <Button
          leftIcon={<CopyIcon />}
          colorScheme="blue"
          variant="solid"
          size="sm"
        >
          Copy Link
        </Button>
      ); // Reset button text after 2 seconds
    }, 2000);
  };

  const convertToIST = (utcTimestamp) => {
    // Create a Date object from the UTC timestamp
    const utcDate = new Date(utcTimestamp);

    // Get the UTC time in milliseconds since the Unix epoch
    const utcTime = utcDate.getTime();

    // IST is UTC + 5 hours 30 minutes (19800000 milliseconds)
    const istOffset = 5.5 * 60 * 60 * 1000;

    // Convert to IST by adding the offset
    const istTime = new Date(utcTime + istOffset);

    // Get date components
    const day = String(istTime.getDate()).padStart(2, "0");
    const month = String(istTime.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = istTime.getFullYear();

    // Get time components
    let hours = istTime.getHours();
    const minutes = String(istTime.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? " p.m." : " a.m.";
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    // Format the IST time as a string
    const istTimeString = `${day}-${month}-${year}, ${hours}.${minutes}${ampm}`;

    return istTimeString;
  };

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
    <Box padding={4}>
      <Box
        border={"1px solid blue"}
        borderRadius={"5"}
        width={{ sm: "100%", lg: "50%" }}
        padding={"4"}
      >
        <h1>File Upload</h1>
        <form onSubmit={handleUpload}>
          <FormControl>
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Input
                type="file"
                onChange={handleFileChange}
                ref={fileInputRef} // Assign ref to input field
                padding={"1"}
                height={"unset"}
                width={"100%"}
              />
            </Box>
          </FormControl>
          <Flex alignItems={"center"} gap={"2"}>
            <Text marginTop={"3"}>
              {file && ` Selected file size: ${formatFileSize(file.size)} `}
            </Text>
            <Button
              mt={4}
              colorScheme="teal"
              type="submit"
              leftIcon={<ArrowUpIcon boxSize={5} />}
            >
              Upload
            </Button>
          </Flex>
        </form>
      </Box>

      <h1>Uploaded Files</h1>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap={{ sm: 2, lg: 4 }}
      >
        {files.map((file) => (
          <GridItem key={file.id}>
            <Box
              mt={2}
              borderWidth="1px"
              borderRadius="lg"
              p={{ base: 2, sm: 4, md: 4, lg: 4 }}
            >
              File Name - {file.filename}
              <br />
              <Box display={{ sm: "block", lg: "flex" }} gap={3}>
                <Text>Uploaded on: {convertToIST(file.upload_time)}</Text>
                <Text>File Size: {formatFileSize(file.size)}</Text>
              </Box>
              <Text>
                Shareble Link:
                <br />
                <a
                  href={shareableUrl(file.token)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shareableUrl(file.token)}
                </a>
              </Text>
              <Box display="flex" alignItems="center">
                <Button
                  colorScheme="teal"
                  leftIcon={<DownloadIcon />}
                  size="sm"
                >
                  <a
                    href={`http://localhost:3001/files/download/${file.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </Button>
                <Box
                  ml={2}
                  onClick={() => copyToClipboard(shareableUrl(file.token))}
                >
                  {copyButtonText}
                </Box>
                <Button
                  ml={2}
                  colorScheme="red"
                  onClick={() => handleDelete(file.id)}
                  leftIcon={<DeleteIcon />}
                  size="sm"
                >
                  Delete File
                </Button>
              </Box>
            </Box>
          </GridItem>
        ))}
      </Grid>
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
