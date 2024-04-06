import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import SearchInputBox from "../../../ui/SearchInputBox";
import { Message } from "../../../../interfaces/types.lib";
import { getMessageDay, getSlicedSubstring } from "../../../../lib/utils.lb";

const SearchMessageDrawer = ({
  children,
  list,
}: {
  children: ReactNode;
  list: Message[];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [messageList, setMessageList] = useState<Message[]>([]);
  const queryRef = useRef({
    query: "",
  });

  const handleQueryChange = (str: string) => {
    if (str === "") {
      setMessageList([]);
      return;
    }
    const filteredList = list.filter((item) => item.content.includes(str));
    console.log(filteredList, "filteredList");
    setMessageList(filteredList);
    queryRef.current.query = str;
  };

  const scrollToMessage = (messageId: string) => {
    // Logic to find the index of the message with the given ID
    const index = list.findIndex((message) => message.id === messageId);
    if (index !== -1) {
      // Logic to scroll the chat window to the message
      // For example, using the DOM API
      const messageElement = document.getElementById(`message-${messageId}`);
      const elem = messageElement?.children[0];
      console.log(messageElement, messageElement?.children, "elem");
      if (elem) {
        messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      elem?.classList.add("changeBackground");
      setTimeout(() => elem?.classList.remove("changeBackground"), 1000);
    }
    onClose();
  };

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        // finalFocusRef={btnRef}
        size={"sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader className="flex items-center bg-c-panel-header-background">
            <div className="flex w-[54px] cursor-pointer" onClick={onClose}>
              <CloseIcon w={4} h={4} color="#3b4a54" />
            </div>
            <div className="flex-1 text-c-primary text-body-16">
              Search Messages
            </div>
          </DrawerHeader>
          <Box
            className="h-[50px] w-full flex items-center border-b border-c-chat-border"
            boxShadow="0 2px 3px #0b141a14"
          >
            <div className="px-3 bg-white w-full flex items-center">
              <SearchInputBox
                placeholder="Search..."
                handleQueryChange={handleQueryChange}
              />
            </div>
          </Box>
          <DrawerBody padding={0}>
            {messageList.length > 0 &&
              [...messageList].reverse().map((item) => (
                <Box
                  className="bg-white h-[72px] flex border-b border-c-chat-border cursor-pointer hover:bg-c-chat-border"
                  key={item.id}
                  onClick={() => scrollToMessage(item.id)}
                >
                  <Box className="px-4 flex flex-col justify-center flex-1 text-c-secondary">
                    <div className="text-body-12">
                      {getMessageDay(item.createdAt)}
                    </div>
                    <div
                      className="text-body-14 mt-[2px] font-medium text-c-secondary overflow-x-hidden"
                      dangerouslySetInnerHTML={{
                        __html: getSlicedSubstring(item.content, 60).replace(
                          new RegExp(queryRef.current.query, "gi"),
                          (match) => `<mark style = "color: #008069; background-color: #ffffff; font-weight: 900;">${match}</mark>`
                        ),
                      }}
                    />
                  </Box>
                </Box>
              ))}
            {!messageList.length && (
              <div className="px-[50px] py-[72px] text-center">
                <p className="text-c-icon-lighter text-body-14">
                  Search for messages with the chat{" "}
                </p>
              </div>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchMessageDrawer;
