import React, { useState } from "react";
import { Box, Button, Text } from "@chakra-ui/react";
import { DeleteIcon, DownloadIcon, CopyIcon } from "@chakra-ui/icons";
import convertToIST from "../utils/convertToIST";
import formatFileSize from "../utils/formatFileSize";

const FileItem = ({ file, shareableUrl, copyToClipboard, handleDelete }) => {
  const [copyButtonText, setCopyButtonText] = useState(
    <Button
      leftIcon={<CopyIcon />}
      colorScheme="blue"
      variant="solid"
      size="sm"
    >
      Copy Link
    </Button>
  );

  const handleCopyClick = () => {
    copyToClipboard(shareableUrl(file.token));
    setCopyButtonText(
      <Button colorScheme="blue" variant="solid" size="sm">
        Copied
      </Button>
    );
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
      );
    }, 2000);
  };

  return (
    <Box
      mt={2}
      borderWidth="1px"
      borderRadius="lg"
      p={{ base: 2, sm: 4, md: 4, lg: 4 }}
      borderColor={"GrayText"}
    >
      <Text>
        <Text as="span" fontWeight="semibold">
          File Name
        </Text>
        {` : ${file.filename}`}
      </Text>
      <Box display={{ sm: "block", lg: "flex" }} gap={3}>
        <Text>
          <Text as="span" fontWeight="semibold">
            Uploaded on
          </Text>
          {` : ${convertToIST(file.createdAt)}`}
        </Text>
        <Text>
          <Text as="span" fontWeight="semibold">
            File Size
          </Text>
          {` : ${formatFileSize(file.size)}`}
        </Text>
      </Box>

      <Text>
        <Text as="span" fontWeight="semibold">
          Shareble Link
        </Text>
        <a
          href={shareableUrl(file.token)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text as={"span"} wordBreak="break-all" overflowWrap="break-word">
            {` : ${shareableUrl(file.token)} `}
          </Text>
        </a>
      </Text>
      <Box display="flex" alignItems="center">
        <Button colorScheme="teal" leftIcon={<DownloadIcon />} size="sm">
          <a
            href={`http://localhost:3001/files/download/${file._id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        </Button>
        <Box ml={2} onClick={handleCopyClick}>
          {copyButtonText}
        </Box>
        <Button
          ml={2}
          colorScheme="red"
          onClick={() => handleDelete(file._id)}
          leftIcon={<DeleteIcon />}
          size="sm"
        >
          Delete File
        </Button>
      </Box>
    </Box>
  );
};

export default FileItem;
