import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const LoadingModal = ({ isOpen, onClose, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Please wait...</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{message}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoadingModal;
