import React, { useCallback } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useDropzone } from "react-dropzone";
import formatFileSize from "../utils/formatFileSize";

const FileUploadForm = ({ file, handleFileChange, handleUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      handleFileChange({ target: { files: acceptedFiles } });
    },
    [handleFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <Box
      border={"1px solid blue"}
      borderRadius={"5"}
      width={{ sm: "100%", lg: "50%" }}
      padding={"4"}
    >
      <form onSubmit={handleUpload}>
        <FormControl>
          <FormLabel htmlFor="file-upload">Upload File</FormLabel>
          <Box
            {...getRootProps()}
            border={"2px dashed gray"}
            borderRadius={"5"}
            padding={"4"}
            textAlign={"center"}
            cursor={"pointer"}
            height={"24"}
            alignContent={"center"}
          >
            <Input
              {...getInputProps()}
              id="file-upload"
              aria-label="File upload input"
              title="Upload your file here"
            />
            {isDragActive ? (
              <Text>Drop the files here...</Text>
            ) : (
              <Text>Drag 'n' drop a file here, or click to select one</Text>
            )}
          </Box>
        </FormControl>
        <Flex alignItems={"center"} gap={"2"} mt={4}>
          <Text>
            {file && `Selected file size: ${formatFileSize(file.size)}`}
          </Text>
          <Button
            size="sm"
            colorScheme="teal"
            type="submit"
            leftIcon={<ArrowUpIcon boxSize={5} />}
          >
            Upload
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default FileUploadForm;
