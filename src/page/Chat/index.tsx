import React from "react";
import Layout from "../../components/layout";
import ChatContextProvider from "../../context/chatProvider";
import { Box } from "@chakra-ui/react";
import MyChats from "../../components/features/Chats/MyChats";
import Chatbox from "../../components/features/Chats/ChatBox";

const Chat = () => {
  return (
    <ChatContextProvider>
      <Layout>
        <Box
          display="flex"
          // justifyContent="space-between"
          w="100%"
          h="100vh"
          // p="10px"
        >
          <MyChats />
          <Chatbox/>
        </Box>
      </Layout>
    </ChatContextProvider>
  );
};

export default Chat;
