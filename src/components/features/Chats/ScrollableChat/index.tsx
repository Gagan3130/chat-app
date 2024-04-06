import ScrollableFeed from "react-scrollable-feed";
import { Message } from "../../../../interfaces/types.lib";
import { Avatar, Box, Text } from "@chakra-ui/react";
import {
  debounce,
  getBackgroundColor,
  getChatTime,
  getLoggedUser,
  getMessageDay,
} from "../../../../lib/utils.lb";
import TailInIcon from "../../../ui/Icons/tail-in.svg";
import TailOut from "../../../ui/Icons/tail-out-svg";
import {
  LegacyRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const MyMessages = ({ item }: { item: Message }) => {
  return (
    <Box
      bgColor="#dcf8c6"
      borderRadius="7.5px"
      p="5px 10px"
      maxW="75%"
      position="relative"
    >
      <Text as="span">{item.content}</Text>
      <Text
        as="span"
        fontSize="11px"
        position={"relative"}
        float={"right"}
        mt={"10px"}
        ml={"8px"}
        color="grey"
      >
        {getChatTime(item.createdAt)}
      </Text>
    </Box>
  );
};

const OtherUserMessages = ({
  item,
  showName = false,
}: {
  item: Message;
  showName?: boolean;
}) => {
  return (
    <Box bgColor={"#ffffff"} borderRadius="7.5px" p="5px 10px" maxW="75%">
      {showName && (
        <Box
          fontSize="14px"
          display="inline-flex"
          color={getBackgroundColor(item.sender.name)}
          fontWeight="bold"
        >
          {item.sender.name}
        </Box>
      )}
      <div>
        <Box as="span">{item.content}</Box>
        <Box
          as="span"
          fontSize="11px"
          position={"relative"}
          float={"right"}
          mt={"10px"}
          ml={"8px"}
          color="grey"
        >
          {getChatTime(item.createdAt)}
        </Box>
      </div>
    </Box>
  );
};

const ScrollabelChat = ({
  messagesList = [],
  hasSeenMessage,
  changePage,
  totalMessages = 0,
  perPage = 50,
  loadingMessage = false
}: {
  messagesList: Message[];
  hasSeenMessage: boolean;
  changePage: (val: number) => void;
  totalMessages?: number;
  perPage?: number;
  loadingMessage?: boolean
}) => {
  const loggedUserId = getLoggedUser();
  const lastMessage = messagesList.at(-1);
  const loggedUser = getLoggedUser();
  const topDivRef = useRef<any>(null);
  const hasSeen = lastMessage?.sender.id === loggedUser && hasSeenMessage;

  const canLoadMore = messagesList.length < totalMessages;

  const fetchMoreMessages = useCallback(debounce(changePage, 100), []);


  useEffect(() => {
    function handleScroll() {
      if (topDivRef?.current?.scrollTop === 0 && canLoadMore && !loadingMessage) {
        fetchMoreMessages(1);
      }
    }

    topDivRef?.current?.addEventListener("scroll", handleScroll, true);
    return () => {
      topDivRef?.current?.removeEventListener("scroll", handleScroll, true);
    };
  }, [canLoadMore, loadingMessage]);

  const renderMessageDay = (item: Message) => {
    return (
      <Box display="flex" justifyContent="center" m="12px 0">
        <Box
          padding="5px 12px"
          borderRadius="7.5px"
          backgroundColor="white"
          color="black"
          fontWeight={500}
          fontSize="12px"
        >
          <Text>{getMessageDay(item.createdAt)}</Text>
        </Box>
      </Box>
    );
  };
  return (
    <div className="overflow-scroll" ref={topDivRef}>
      <ScrollableFeed className=" overflow-y-hidden">
        {messagesList.map((item, index) => {
          const isSameSender =
            item.sender.id === messagesList[index + 1]?.sender.id;
          if (item.sender.id === loggedUserId) {
            return (
              <>
                {getMessageDay(item.createdAt) !==
                  getMessageDay(messagesList[index - 1]?.createdAt) &&
                  renderMessageDay(item)}
                <Box
                  mb={isSameSender ? "3px" : "15px"}
                  display="flex"
                  justifyContent="end"
                  padding="0 50px"
                  position="relative"
                  id={`message-${item.id}`}
                >
                  {!isSameSender && (
                    <Box
                      as="span"
                      position="absolute"
                      right="43px"
                      top={0}
                      width={"16px"}
                      height={"16px"}
                    >
                      <TailOut colour="#dcf8c6" />
                    </Box>
                  )}
                  <MyMessages item={item} />
                  {hasSeen && item.id === lastMessage?.id && (
                    <Text
                      position="absolute"
                      bottom="-16px"
                      fontSize="12px"
                      color="grey"
                    >
                      seen
                    </Text>
                  )}
                </Box>
              </>
            );
          }
          return (
            <>
              {getMessageDay(item.createdAt) !==
                getMessageDay(messagesList[index - 1]?.createdAt) &&
                renderMessageDay(item)}
              <Box
                mb={isSameSender ? "3px" : "15px"}
                display="flex"
                justifyContent="start"
                padding="0 50px"
                position="relative"
                id={`message-${item.id}`}
              >
                {!isSameSender && item.chat.isGroupChat && (
                  <Avatar
                    size="sm"
                    cursor="pointer"
                    name={item.sender.name}
                    src={item.sender.pic}
                    position="absolute"
                    left={"10px"}
                  />
                )}
                {!isSameSender && (
                  <Box
                    as="span"
                    position="absolute"
                    left="43px"
                    top={0}
                    width={"20px"}
                    height={"20px"}
                  >
                    <TailInIcon colour="#ffffff" />
                  </Box>
                )}
                <OtherUserMessages
                  item={item}
                  showName={item.chat.isGroupChat && !isSameSender}
                />
              </Box>
            </>
          );
        })}
      </ScrollableFeed>
    </div>
  );
};

export default ScrollabelChat;
