import Dialog from "../../ui/Dialog";
import { Image, ModalBody, ModalHeader, Text } from "@chakra-ui/react";
import { useChatContext } from "../../../context/chatProvider";
import { User } from "../../../interfaces/types.lib";

type propType = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null
};

const MyProfile = (props: propType) => {
  const { isOpen = false, onClose = () => null, user } = props;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} hasFooter>
      <ModalHeader
        fontSize="40px"
        fontFamily="Work sans"
        display="flex"
        justifyContent="center"
      >
        {user?.name ?? ""}
      </ModalHeader>
      <ModalBody
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Image
          borderRadius="full"
          boxSize="150px"
          src={user?.pic}
          alt={user?.name}
          objectFit="cover"
        />
        <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
          Email: {user?.email}
        </Text>
      </ModalBody>

    </Dialog>
  );
};

export default MyProfile;
