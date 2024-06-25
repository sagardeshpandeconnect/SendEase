import React, { useEffect } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { fetchFiles, shareableUrl } from "./services/apiClient";
import { useFileHandling } from "./hooks/useFileHandling";
import { useClipboard } from "./hooks/useClipboard";
import { convertToIST } from "./utils/convertToIST";
import { formatFileSize } from "./utils/formatFileSize";
import FileUploadForm from "./components/FileUploadForm";
import UploadedFilesList from "./components/UploadedFilesList";
import LoadingModal from "./components/LoadingModal";

function App() {
  const BASE_URL = import.meta.env.VITE_APP_API_URL;

  const {
    files,
    file,
    uploading,
    deleting,
    setFile,
    setFiles,
    handleFileChange,
    handleUpload,
    handleDelete,
    fileInputRef,
  } = useFileHandling();
  const { copyToClipboard, copyButtonText } = useClipboard();

  useEffect(() => {
    fetchFiles()
      .then((sortedFiles) => setFiles(sortedFiles))
      .catch((error) => console.error("Error loading files:", error));
  }, []);

  return (
    <Box padding={4}>
      <Box
        border={"1px solid blue"}
        borderRadius={"5"}
        width={{ sm: "100%", lg: "50%" }}
        padding={"4"}
      >
        <h1>File Upload</h1>
        <FileUploadForm
          file={file}
          setFile={setFile}
          handleFileChange={handleFileChange}
          handleUpload={handleUpload}
          fileInputRef={fileInputRef}
        />
      </Box>

      <h1>Uploaded Files</h1>
      <UploadedFilesList
        files={files}
        BASE_URL={BASE_URL}
        convertToIST={convertToIST}
        formatFileSize={formatFileSize}
        shareableUrl={shareableUrl}
        copyToClipboard={copyToClipboard}
        copyButtonText={copyButtonText}
        handleDelete={handleDelete}
      />

      <LoadingModal
        isOpen={uploading || deleting}
        uploading={uploading}
        deleting={deleting}
      />
    </Box>
  );
}

export default App;
