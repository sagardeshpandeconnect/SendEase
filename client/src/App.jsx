import React from "react";
import { Box } from "@chakra-ui/react";
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
      <UploadedFilesList
        files={files}
        shareableUrl={shareableUrl}
        copyButtonText={copyButtonText}
        copyToClipboard={copyToClipboard}
        handleDelete={handleDelete}
      />
      <LoadingModal
        isOpen={uploading}
        onClose={() => setUploading(false)}
        message="Uploading file, please wait a moment..."
      />
      <LoadingModal
        isOpen={deleting}
        onClose={() => setDeleting(false)}
        message="Deleting file, please wait a moment..."
      />
    </Box>
  );
}

export default App;
