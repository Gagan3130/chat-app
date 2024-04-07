import { Avatar, Box } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type propType = {
  avatarName?: string;
  avatarImageSrc?: string;
  chatName: string;
  chatLastTime?: string;
  content: ReactNode;
  notifications?: number;
};

const UserChatItem = (props: propType) => {
  const {
    avatarImageSrc,
    avatarName,
    chatName,
    chatLastTime,
    content,
    notifications = 0,
  } = props;
  return (
    <div className="h-[72px] flex relative cursor-pointer">
      <Box className="flex items-center px-4">
        <Avatar
          size="md"
          cursor="pointer"
          name={avatarName}
          src={avatarImageSrc}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        className="pr-4 flex-1 border-b border-c-chat-border"
      >
        <Box display="flex" alignItems="center">
          <Box fontSize="16px" display="flex" flexGrow={1} lineHeight="21px">
            {chatName}
          </Box>
          {chatLastTime && (
            <Box
              fontSize="12px"
              mt={"3px"}
              ml={"6px"}
              color={notifications > 0 ? "#1fa855" : "#667781"}
              fontWeight={700}
            >
              {chatLastTime}
            </Box>
          )}
        </Box>
        <Box display="flex" alignItems="center" mt={"2px"}>
          {content && (
            <Box
              fontSize="14px"
              textAlign="left"
              display="flex"
              color="#3b4a54"
              flexGrow={1}
            >
              {content}
            </Box>
          )}
          {notifications > 0 && (
            <Box
              backgroundColor="#25d366"
              fontSize="12px"
              fontWeight={500}
              color="#ffffff"
              p="0 0.4rem"
              className="rounded-full"
            >
              {notifications}
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UserChatItem;
