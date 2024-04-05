import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

type propType = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  hasFooter?: boolean;
  size?: 'lg' | 'sm' | 'md' | 'xl' | 'xs'
};

const Dialog = (props: propType) => {
  const { children, onClose, isOpen, hasFooter = false, size = "lg" } = props;
  return (
    <Modal size={size} onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        {children}
        {hasFooter && (
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Dialog;
