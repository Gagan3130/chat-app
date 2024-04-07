import React from "react";
import Layout from "../../components/layout";
import ChatContextProvider, { useChatContext } from "../../context/chatProvider";
import { Box } from "@chakra-ui/react";
import MyChats from "../../components/features/Chats/MyChats";
import Chatbox from "../../components/features/Chats/ChatBox";
import EmptyChatBox from "../../components/features/Chats/EmptyChatBox";

const Chat = () => {
  const {currentChat} = useChatContext()
  return (
      <Layout>
        <Box
          display="flex"
          w="100%"
          h="100vh"
        >
          <MyChats />
          {currentChat?.id && <Chatbox key={currentChat?.id}/>}
          {!currentChat && <EmptyChatBox />}
        </Box>
      </Layout>
  );
};

export default Chat;
