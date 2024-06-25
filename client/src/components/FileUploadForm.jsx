import React from "react";
import { FormControl, Box, Input, Flex, Text, Button } from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { formatFileSize } from "../utils/formatFileSize";

const FileUploadForm = ({
  file,
  handleFileChange,
  handleUpload,
  fileInputRef,
}) => {
  return (
    <form onSubmit={handleUpload}>
      <FormControl>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
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
  );
};

export default FileUploadForm;
