import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import OffCanvas from "../ui/Offcanvas";
import { useChatContext } from "../../context/chatProvider";
import { logoutUser } from "../../api";
import MyProfile from "../features/MyProfile";
import { SearchUser } from "../ui/Shimmers/SearchUser";
import { useRef } from "react";
import { useApiRequest } from "../../hooks/useApiRequestService";
import { AppConfig } from "../../api/endpoints";
import { Chat, User } from "../../interfaces/types.lib";
import UserListItem from "../features/UserListItem";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: open,
    onOpen: handleOpen,
    onClose: handleClose,
  } = useDisclosure();
  const { profileData, chatList,fetchChats, changeCurrentChat } = useChatContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { apiRequestService, loading, apiData: userList } = useApiRequest();
  const { apiRequestService: accessUserChat, loading: chatLoading } = useApiRequest()

  const handleChange = (e: any) => {
    if (inputRef.current) inputRef.current.value = e.target.value;
  };

  const handleUserSearch = async () => {
    await apiRequestService<null, User[]>({
      url: `${AppConfig.endpoints.user}?search=${inputRef.current?.value}`,
      method: "get",
    });
  };

  const handleAccessChat = async (userId: string) => {
    const response = await accessUserChat<{ userId: string }, Chat>({
      method: 'post',
      url: AppConfig.endpoints.chats,
      body: { userId }
    })
    if (response.success && response.data?.id) {
      const chat = chatList?.find(item => item.id === userId)
      if (!chat) {
        fetchChats();
        changeCurrentChat(response.data)
      }
    }
    onClose()
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      height="8.5vh"
    >
      <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <SearchIcon />
          <Text fontWeight={500} display={{ base: "none", md: "flex" }} px={4}>
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily="Work sans">
        Rabbit
      </Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize="2xl" />
          </MenuButton>
        </Menu>
        <Menu>
          <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
            <Avatar size="sm" cursor="pointer" name={profileData?.name} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleOpen}>My Profile</MenuItem>
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>
      <OffCanvas title="Search Users" isOpen={isOpen} onClose={onClose}>
        <>
          <Box display="flex" gap="2" pb={2}>
            <Input
              ref={inputRef}
              placeholder="Type here..."
              onChange={handleChange}
            />
            <Button onClick={handleUserSearch}>Go</Button>
          </Box>

          {loading ? (
            <SearchUser />
          ) : (
            userList?.map((user: User) => (
              <UserListItem user={user} key={user.id} handleFunction={()=>handleAccessChat(user.id)} loading={chatLoading} />
            ))
          )}
        </>
      </OffCanvas>
      <MyProfile isOpen={open} onClose={handleClose} user={profileData}/>
    </Box>
  );
};

export default Header;
