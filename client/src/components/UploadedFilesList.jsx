import React from "react";
import { Box, Button, Grid, GridItem, Text } from "@chakra-ui/react";
import { DownloadIcon, DeleteIcon } from "@chakra-ui/icons";

const UploadedFilesList = ({
  files,
  convertToIST,
  formatFileSize,
  shareableUrl,
  copyToClipboard,
  copyButtonText,
  handleDelete,
}) => {
  const handleDownload = (id) => {
    const downloadUrl = `${BASE_URL}/files/download/${id}`;
    console.log("Download URL:", downloadUrl); // Debugging log
    try {
      window.open(downloadUrl, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error); // Error handling
      alert(
        "Error downloading file. Please ensure your browser is configured to download files."
      );
    }
  };

  return (
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
            <Text>File Name - {file.filename}</Text>
            <Box display={{ sm: "block", lg: "flex" }} gap={3}>
              <Text>Uploaded on: {convertToIST(file.upload_time)}</Text>
              <Text>File Size: {formatFileSize(file.size)}</Text>
            </Box>
            <Text>
              Shareable Link:
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
                onClick={() => handleDownload(file.id)}
              >
                Download
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
  );
};

export default UploadedFilesList;
