import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const LoadingModal = ({ isOpen, uploading, deleting }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => setUploading(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Please wait...</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {uploading && "Uploading file, please wait a moment..."}
          {deleting && "Deleting file, please wait a moment..."}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoadingModal;
