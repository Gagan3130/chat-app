import { Avatar, Box, Button, Spinner, Text } from "@chakra-ui/react";
import { User } from "../../../interfaces/types.lib";

const UserListItem = ({ user, loading, handleFunction }: { user: User; loading?: boolean; handleFunction: any }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      justifyContent="start"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text textAlign="left">{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
      {loading && <Spinner ml="auto" display="flex"/>}
    </Box>
  );
};

export default UserListItem;
