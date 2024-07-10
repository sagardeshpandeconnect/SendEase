import React, { useState, useEffect } from "react";
import { Grid, GridItem, Button, Flex, Text, Skeleton } from "@chakra-ui/react";
import FileItem from "./FileItem";

const UploadedFilesList = ({
  files,
  shareableUrl,
  copyToClipboard,
  handleDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const filesPerPage = 10;
  const totalPages = Math.ceil(files.length / filesPerPage);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [files]);

  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.slice(
      Math.max(0, currentPage - 2),
      Math.min(currentPage + 1, totalPages)
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Text fontWeight={"semibold"}>Uploaded Files</Text>
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap={{ sm: 2, lg: 4 }}
      >
        {loading
          ? Array(filesPerPage)
              .fill("")
              .map((_, index) => (
                <GridItem key={`skeleton-${index}`}>
                  <Skeleton
                    height={{ base: "10rem", md: "8rem" }}
                    borderRadius="8px"
                    marginTop={"2"}
                  />
                </GridItem>
              ))
          : currentFiles.map((file) => (
              <GridItem key={file._id}>
                <FileItem
                  file={file}
                  shareableUrl={shareableUrl}
                  copyToClipboard={copyToClipboard}
                  handleDelete={handleDelete}
                />
              </GridItem>
            ))}
      </Grid>
      <Flex justifyContent="center" mt={4}>
        {currentPage > 1 && (
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            mr={2}
            _hover={{ bg: "teal.600" }}
            transition="background 0.3s ease"
          >
            Prev
          </Button>
        )}
        {renderPageNumbers().map((number) => (
          <Button
            key={`page-${number}`}
            onClick={() => handlePageChange(number)}
            colorScheme={number === currentPage ? "teal" : "gray"}
            mx={1}
            _hover={{ bg: "teal.600" }}
            transition="background 0.3s ease"
          >
            {number}
          </Button>
        ))}
        {currentPage < totalPages && (
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            ml={2}
            _hover={{ bg: "teal.600" }}
            transition="background 0.3s ease"
          >
            Next
          </Button>
        )}
      </Flex>
    </>
  );
};

export default UploadedFilesList;
