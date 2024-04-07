import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchUser } from "../../../ui/Shimmers/SearchUser";
import {
  chatLastTimeAndDay,
  getLoggedUser,
  getSender,
  getSlicedSubstring,
} from "../../../../lib/utils.lb";
import { useChatContext } from "../../../../context/chatProvider";
import { Chat } from "../../../../interfaces/types.lib";
import GroupChatModal from "../GroupChatModal";
import { useEffect, useMemo, useState } from "react";
import NewChatIcon from "../../../ui/Icons/new-chat.svg";
import SettingIcon from "../../../ui/Icons/setting.svg";
import UnreadMessageIcon from "../../../ui/Icons/unread-message.svg";
import MyProfile from "../../MyProfile";
import { logoutUser } from "../../../../api";
import SearchInputBox from "../../../ui/SearchInputBox";
import ContactsDrawer from "../ContactsDrawer";
import UserChatItem from "../UserChatItem";

const MyChats = () => {
  const {
    chatList,
    changeCurrentChat,
    currentChat,
    chatsLoading,
    notifications,
    profileData,
    // changeNotifications,
  } = useChatContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: open,
    onOpen: handleOpen,
    onClose: handleClose,
  } = useDisclosure();
  const loggedUser = getLoggedUser();
  const [openUnreadMessage, setOpenUnreadMessage] = useState(false);
  const [chatData, setChatData] = useState<Chat[]>([]);

  useEffect(() => {
    setChatData(chatList ?? []);
  }, [chatList]);

  const handleUnreadChats = () => {
    setOpenUnreadMessage((val) => !val);
    if (!openUnreadMessage) {
      const list = chatList?.filter((item) => notifications[item.id] > 0);
      setChatData(list ?? []);
    } else setChatData(chatList ?? []);
  };

  useEffect(() => {
    if (openUnreadMessage) {
      const list = chatList?.filter((item) => notifications[item.id] > 0);
      setChatData(list ?? []);
    }
  }, [notifications]);

  const settingsList = [
    {
      id: 1,
      label: "New Group Chat",
      callbackFn: onOpen,
    },
    {
      id: 2,
      label: "My Profile",
      callbackFn: handleOpen,
    },
    {
      id: 3,
      label: "Logout",
      callbackFn: logoutUser,
    },
  ];

  return (
    <>
      <Box
        display={{ base: currentChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        bg="white"
        w={{ base: "100%", md: "42%" }}
        className="md:flex-[0_0_30%] h-full"
      >
        <header className="w-full py-[10px] px-4 h-[60px] box-border flex items-center bg-c-panel-header-background border-r">
          <Box className="flex-1">
            <Avatar
              size="md"
              cursor="pointer"
              name={profileData?.name}
              src={profileData?.pic}
            />
          </Box>
          <Box className="flex">
            <ContactsDrawer>
              <div className="p-2 cursor-pointer">
                <NewChatIcon />
              </div>
            </ContactsDrawer>
            <Menu>
              <MenuButton className="bg-c-panel-header-background p-2">
                <SettingIcon />
              </MenuButton>
              <MenuList className="text-c-primary text-body-14 font-medium">
                {settingsList.map((item) => (
                  <MenuItem
                    key={item.id}
                    onClick={item.callbackFn}
                    className="h-[40px]"
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </header>
        <Box
          className="h-[50px] w-full flex items-center mb-1"
          boxShadow="0 2px 3px #0b141a14"
        >
          <div className="pl-3 bg-white w-full flex items-center">
            <SearchInputBox placeholder="Search or start a new chat" />
            <div
              className={`mx-2 flex items-center justify-center w-[26px] h-[26px] rounded-full cursor-pointer ${
                openUnreadMessage ? "bg-c-icon-high-emphasis" : ""
              }`}
              onClick={handleUnreadChats}
            >
              <UnreadMessageIcon
                className={`${
                  !openUnreadMessage ? "fill-c-icon-lighter" : "fill-white"
                }`}
              />
            </div>
          </div>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          bg="#F8F8F8"
          w="100%"
          overflowY="hidden"
        >
          {chatData && (
            <Stack overflowY="scroll" spacing={0}>
              {chatData.map((chat: Chat) => (
                <Box
                  onClick={() => {
                    console.log("here is");
                    changeCurrentChat(chat);
                  }}
                  bg={currentChat?.id === chat.id ? "#f0f2f5" : "#ffffff"}
                  cursor="pointer"
                  color="black"
                  key={chat.id}
                >
                  <UserChatItem
                    avatarName={
                      chat?.isGroupChat
                        ? chat?.chatName
                        : chat?.users.find((item) => item.id !== loggedUser)
                            ?.name
                    }
                    avatarImageSrc={
                      chat?.users.find((item) => item.id !== loggedUser)?.pic
                    }
                    chatName={
                      !chat.isGroupChat
                        ? getSender(loggedUser, chat?.users)
                        : chat?.chatName
                    }
                    chatLastTime={chatLastTimeAndDay(
                      chat.latestMessage?.createdAt
                    )}
                    content={
                      <>
                        {chat?.latestMessage?.sender?.id === loggedUser && (
                          <b>You : </b>
                        )}
                        {getSlicedSubstring(chat?.latestMessage?.content)}
                      </>
                    }
                    notifications={notifications[chat.id]}
                  />
                </Box>
              ))}
            </Stack>
          )}
          {/* {chatsLoading && <SearchUser />} */}
        </Box>
        {openUnreadMessage && !chatData.length && (
          <Box className="bg-white w-full h-full flex justify-center items-center">
            <div className="flex flex-col justify-center w-full items-center gap-4">
              <h3 className="text-c-icon-lighter font-medium text-body-16">
                No Unread Chats
              </h3>
              <p
                className="text-c-button-secondary text-body-14 font-medium cursor-pointer"
                onClick={handleUnreadChats}
              >
                Clear Filter
              </p>
            </div>
          </Box>
        )}
      </Box>
      <GroupChatModal open={isOpen} onClose={onClose} edit={false} />
      <MyProfile isOpen={open} onClose={handleClose} user={profileData} />
    </>
  );
};

export default MyChats;
