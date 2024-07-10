import React from "react";
import { Box, Divider } from "@chakra-ui/react";
import useFileHandling from "./hooks/useFileHandling";
import useClipboard from "./hooks/useClipboard";
import FileUploadForm from "./components/FileUploadForm";
import UploadedFilesList from "./components/UploadedFilesList";
import LoadingModal from "./components/LoadingModal";

function App() {
  const {
    files,
    file,
    uploading,
    deleting,
    fileInputRef,
    handleFileChange,
    handleUpload,
    handleDelete,
    shareableUrl,
  } = useFileHandling();
  const { copyButtonText, copyToClipboard } = useClipboard();

  return (
    <Box padding={4}>
      <FileUploadForm
        file={file}
        handleFileChange={handleFileChange}
        handleUpload={handleUpload}
        fileInputRef={fileInputRef}
      />
      <Divider border="2px solid blue" marginY={"4"} />
      <UploadedFilesList
        files={files}
        shareableUrl={shareableUrl}
        copyButtonText={copyButtonText}
        copyToClipboard={copyToClipboard}
        handleDelete={handleDelete}
      />
      <LoadingModal
        isOpen={uploading}
        message="Uploading file, please wait a moment...
        Go to page No.1 to access the recently added files"
      />
      <LoadingModal
        isOpen={deleting}
        message="Deleting file, please wait a moment..."
      />
    </Box>
  );
}

export default App;
