import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
} from "@chakra-ui/react";

type propType = {
  position?: "right" | "left";
  title: string;
  isOpen: boolean;
  onClose: () => void;
  hasCloseIcon?: boolean;
  children: React.ReactElement;
  hasFooter?: true;
      onSave?: () => void;
};

const OffCanvas = (props: propType) => {
  const {
    position = "left",
    title,
    hasFooter = false,
    isOpen,
    onClose,
    hasCloseIcon = true,
    children,
    onSave = () => null,
  } = props;

  return (
    <Drawer isOpen={isOpen} placement={position} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        {hasCloseIcon && <DrawerCloseButton />}
        <DrawerHeader borderBottomWidth="1px">{title}</DrawerHeader>

        <DrawerBody>{children}</DrawerBody>

        {hasFooter && (
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={onSave}>
              Save
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default OffCanvas;
