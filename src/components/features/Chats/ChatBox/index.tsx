import { Box, Text } from "@chakra-ui/layout";
import { useChatContext } from "../../../../context/chatProvider";
import {
  Avatar,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBackIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import {
  getLoggedUser,
  getSender,
  getSenderFull,
} from "../../../../lib/utils.lb";
import MyProfile from "../../MyProfile";
import GroupChatModal from "../GroupChatModal";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useApiRequest } from "../../../../hooks/useApiRequestService";
import { AppConfig } from "../../../../api/endpoints";
import { Message } from "../../../../interfaces/types.lib";
import ScrollabelChat from "../ScrollableChat";
import animationData from "../../../../animations/typing.json";
import Lottie from "react-lottie";
import EmptyChatBox from "../EmptyChatBox";
import SettingIcon from "../../../ui/Icons/setting.svg";
import SearchMessageDrawer from "../SearchMessageDrawer";

// "https://talk-a-tive.herokuapp.com"; -> After deployment
var selectedChatCompare: any;

const Chatbox = () => {
  const {
    currentChat,
    changeCurrentChat,
    profileData,
    fetchChats,
    removeNotifications,
    socket,
    onlineUsers,
    notifications,
  } = useChatContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { apiRequestService: messageService } = useApiRequest();
  const { apiRequestService: readMessageService } = useApiRequest();
  const [typing, setTyping] = useState(false);
  const [hasSeenMessage, setSeenMessage] = useState(false);
  const [lastMessagesId, setLastMessagesId] = useState<string>();
  // const [page, setPage] = useState(1);
  const [istyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { loading, apiRequestService: getMessageServices } = useApiRequest();
  const [inputMessage, setInputMessage] = useState("");
  const loggedUser = getLoggedUser();
  const [messageList, setMessageList] = useState<{
    count: number;
    messages: Message[];
  }>({ count: 0, messages: [] });

  const chatUserId = currentChat?.users.find(
    (item) => item.id !== loggedUser
  )?.id;

  const isOnline = onlineUsers.some((elem) => elem.userId === chatUserId);

  const readMessage = async (chatId: string) => {
    const res = await readMessageService<{}, Message[]>({
      method: "put",
      url: `${AppConfig.endpoints.message}/${chatId}`,
    });
    if (res.success === true) {
      const readUsersList = res.data?.at(-1)?.readBy;
      const senderId = res.data?.at(-1)?.sender.id;
      socket.emit("read-message", senderId, readUsersList);
    }
    return res;
  };

  useEffect(() => {
    if (socket === null) return;
    if (currentChat && notifications[currentChat.id] > 0) {
      readMessage(currentChat?.id).then((res) => {
        if (res.success === true) {
          removeNotifications(currentChat.id);
        }
      });
    }
  }, [currentChat, notifications, socket]);

  useEffect(() => {
    if (socket === null) return;
    socket.on("readers-list", (readUsersList: string[]) => {
      setSeenMessage(
        readUsersList.length === selectedChatCompare?.users.length
      );
    });
    return () => socket.off("readers-list");
  }, [socket, selectedChatCompare]);

  const fetchMessages = async () => {
    const res = await getMessageServices<
      null,
      { count: number; messages: Message[] }
    >({
      method: "get",
      url: `${AppConfig.endpoints.message}/${currentChat?.id}`,
    });
    if (res.success === true) {
      setMessageList((val: { count: number; messages: Message[] }) => {
        return {
          count: res?.data?.count ?? 0,
          messages: [...(res.data?.messages ?? [])],
        };
      });
      setLastMessagesId(res.data?.messages?.at(-1)?.id);
      setSeenMessage(
        res.data?.messages?.at(-1)?.readBy.length === currentChat?.users.length
      );
    }
  };

  const scrollMoreMessages = async (page: number) => {
    const res = await getMessageServices<
      null,
      { count: number; messages: Message[] }
    >({
      method: "get",
      url: `${AppConfig.endpoints.message}/${currentChat?.id}?page=${page}`,
    });
    if (res.success === true) {
      setMessageList((val: { count: number; messages: Message[] }) => {
        return {
          count: res?.data?.count ?? 0,
          messages: [...(res.data?.messages ?? []), ...val.messages],
        };
      });
      setLastMessagesId(res.data?.messages?.at(-1)?.id);
    }
  };

  useEffect(() => {
    if (socket === null) return;
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;
    if (currentChat) {
      fetchMessages();
    }
    selectedChatCompare = currentChat;
  }, [currentChat, socket]);

  const sendMessage = async (message: string) => {
    if (!message) return;
    const payload = {
      content: message,
      chatId: currentChat?.id,
    };
    const newMessage = await messageService<
      { content: string; chatId: string | undefined },
      Message
    >({
      method: "post",
      url: AppConfig.endpoints.message,
      body: payload,
    });
    setInputMessage("");
    socket?.emit("send-message", newMessage.data);
  };

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && e.shiftKey == false) {
      e.preventDefault();
      sendMessage((e!.target as HTMLInputElement)!.value);
    }
  }

  useEffect(() => {
    if (socket === null) return;
    const handleMessages = (message: Message, user: string) => {
      console.log(user, "userid");
      console.log(selectedChatCompare, "selectedCompare");
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare?.id !== message.chat.id
      ) {
        console.log("inside sssss");
        fetchChats();
      } else {
        console.log("inside vvvvvv");
        setMessageList((prev: { count: number; messages: Message[] }) => {
          return {
            count: prev.count,
            messages: [...prev.messages, message],
          };
        });
        setSeenMessage(false);
        message.sender.id !== loggedUser &&
          readMessage(selectedChatCompare?.id);
        fetchChats();
      }
    };
    socket.on("receive-message", handleMessages);
    return () => socket?.off("receive-message", handleMessages);
  }, [socket]);

  const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputMessage((e!.target as HTMLInputElement)!.value);
    if (!typing) {
      setTyping(true);
      socket?.emit("typing", currentChat?.id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket?.emit("stop typing", currentChat?.id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    if (lastMessagesId) {
      const messageElement = document.getElementById(
        `message-${lastMessagesId}`
      );
      messageElement?.scrollIntoView({ block: "center" });
    }
  }, [lastMessagesId]);

  return (
    <>
      <Box
        display={{ base: currentChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDir="column"
        w={{ base: "100%" }}
        borderWidth="1px"
      >
        <header className=" py-[10px] px-4 border-l-1 border-c-conversation-header-border bg-c-panel-header-background h-[60px] w-full relative z-50 box-border flex items-center">
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => changeCurrentChat(undefined)}
            aria-label=""
            fontSize="20px"
          />
          <div className="pr-4">
            <Avatar
              size="md"
              cursor="pointer"
              name={
                currentChat?.isGroupChat
                  ? currentChat?.chatName
                  : currentChat?.users.find((item) => item.id !== loggedUser)
                      ?.name
              }
              src={
                currentChat?.users.find((item) => item.id !== loggedUser)?.pic
              }
            />
          </div>
          <Box className="flex flex-col flex-1 justify-center">
            <div className="text-body-16 font-medium">
              {currentChat?.isGroupChat
                ? currentChat?.chatName
                : currentChat?.users.find((item) => item.id !== loggedUser)
                    ?.name}
            </div>
            {isOnline && (
              <div className="text-c-secondary text-body-14">online</div>
            )}
          </Box>
          <Box className="flex justify-center items-center gap-4">
            <SearchMessageDrawer list={messageList?.messages}>
              <div className="p-2 flex cursor-pointer">
                <SearchIcon color="#54656f" w={5} h={5} />
              </div>
            </SearchMessageDrawer>
            <Menu>
              <MenuButton className="bg-c-panel-header-background p-2">
                <SettingIcon />
              </MenuButton>
              <MenuList className="text-c-primary text-body-14 font-medium">
                <MenuItem onClick={onOpen} className="h-[40px]">
                  View Contact
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </header>
        <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
          ref={containerRef}
          className="no-scrollbar"
        >
          <ScrollabelChat
            messagesList={messageList.messages}
            totalMessages={messageList?.count}
            hasSeenMessage={hasSeenMessage}
            changePage={(num) => {
              scrollMoreMessages(num);
            }}
            loadingMessage={loading}
          />
        </Box>
        <footer className="min-h-[62px] w-full box-border relative order-3">
          <Box className="py-[5px] px-4 bg-c-panel-header-background min-h-[62px] relative box-border flex items-center">
            <Input
              variant="unstyled"
              bg="#fff"
              placeholder="Type a message"
              onKeyDown={handleKeyDown}
              value={inputMessage}
              onChange={typingHandler}
              padding="12px"
              borderRadius="8px"
            />
          </Box>
        </footer>
      </Box>
      {!currentChat?.isGroupChat ? (
        <MyProfile
          isOpen={isOpen}
          onClose={onClose}
          user={getSenderFull(profileData?.id ?? "", currentChat?.users ?? [])}
        />
      ) : (
        <GroupChatModal
          open={isOpen}
          onClose={onClose}
          chatDetails={currentChat}
          edit
        />
      )}
    </>
  );
};

export default Chatbox;
