import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";

const LoadingModal = ({ isOpen, message }) => {
  return (
    <Modal isOpen={isOpen} size={{ base: "xs", md: "md" }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader padding={4}>Please wait...</ModalHeader>
        <ModalBody padding={4}>{message}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoadingModal;
