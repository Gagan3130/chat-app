"use client";

import React, {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useApiRequest } from "../hooks/useApiRequestService";
import { AppConfig } from "../api/endpoints";
import { Chat, Message, User } from "../interfaces/types.lib";
import { io } from "socket.io-client";
import { getLoggedUser } from "../lib/utils.lb";

interface IChatContextData {
  isProfileFetching: boolean;
  profileData: User | null;
  chatList: Chat[] | null;
  changeCurrentChat: (chat: Chat | undefined) => void;
  currentChat: Chat | undefined;
  fetchChats: () => void;
  chatsLoading: boolean;
  socket: any;
  addNotifications: (chatId: string) => void;
  removeNotifications: (chatId: string) => void;
  notifications: Record<string, number>;
  // changeNotifications: (messages: Message[]) => void;
  onlineUsers: { userId: string; socketId: string }[];
}

export const ChatContextData = createContext<IChatContextData>({
  isProfileFetching: false,
  profileData: null,
  chatList: null,
  changeCurrentChat: () => null,
  currentChat: undefined,
  fetchChats: () => null,
  chatsLoading: false,
  socket: null,
  addNotifications: () => null,
  removeNotifications: () => null,
  notifications: {},
  // changeNotifications: () => null,
  onlineUsers: [],
});

interface IChatContextProvider {
  children: React.JSX.Element;
}

const ChatContextProvider = (props: IChatContextProvider) => {
  const { apiData, loading } = useApiRequest(AppConfig.endpoints.profile, true);
  const {
    apiData: chatList,
    refetchData,
    loading: chatsLoading,
    setApiData: setChatList,
  } = useApiRequest(AppConfig.endpoints.chats, true);
  const [currentChat, setCurrentChat] = useState<Chat>();
  const userId = getLoggedUser();
  const [notifications, setNotifications] = useState<Record<string, number>>(
    {}
  );
  const [onlineUsers, setOnlineUsers] = useState<
    { userId: string; socketId: string }[]
  >([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    let obj: Record<string, number> = {};
    chatList?.forEach((item: Chat) => {
      const chatId = item.id;
      obj[chatId] = item.unreadCount;
    });
    setNotifications(obj);
  }, [chatList]);

  const addNotifications = (chatId: string) => {
    setNotifications((val) => {
      return {
        ...val,
        [chatId]: val[chatId] + 1,
      };
    });
  };

  // const removeNotifications = (newMessage: Message) => {
  //   setNotifications((prev) =>
  //     prev.filter((item) => item.id !== newMessage.id)
  //   );
  // };

  useEffect(() => {
    const connection = io(AppConfig.baseUrl);
    setSocket(connection);
    return () => {
      connection.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("newUser", userId);
    socket.on(
      "getOnlineUsers",
      (onlineUsers: { userId: string; socketId: string }[]) => {
        setOnlineUsers(onlineUsers);
      }
    );

    return () => socket.off("getOnlineUsers");
  }, [socket]);

  const changeCurrentChat = (chat: Chat | undefined) => {
    setCurrentChat(chat);
  };

  const removeNotifications = (chatId: string) => {
    setNotifications((val) => {
      return { ...val, [chatId]: 0 };
    });
  };

  const fetchChats = async () => {
    const response = await refetchData<{}, Chat[]>({
      method: "get",
      url: AppConfig.endpoints.chats,
    });
    // if (currentChat) {
    //   const data = response?.data?.find((c) => c.id === currentChat.id);
    //   if (data) setCurrentChat(data);
    // }
  };

  const contextValue = useMemo(
    () => ({
      profileData: apiData,
      isProfileFetching: loading,
      chatList,
      changeCurrentChat,
      currentChat,
      fetchChats,
      chatsLoading,
      socket,
      removeNotifications,
      addNotifications,
      notifications,
      // changeNotifications,
      onlineUsers,
    }),
    [
      apiData,
      loading,
      chatList,
      currentChat,
      fetchChats,
      chatsLoading,
      socket,
      removeNotifications,
      addNotifications,
      notifications,
      setNotifications,
      // changeNotifications,
      changeCurrentChat,
      onlineUsers,
    ]
  );

  return (
    <ChatContextData.Provider value={contextValue}>
      {props.children}
    </ChatContextData.Provider>
  );
};

export default ChatContextProvider;

export const useChatContext = () => useContext(ChatContextData);
