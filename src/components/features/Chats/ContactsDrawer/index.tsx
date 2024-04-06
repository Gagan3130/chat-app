import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import SearchInputBox from "../../../ui/SearchInputBox";
import { useApiRequest } from "../../../../hooks/useApiRequestService";
import { AppConfig } from "../../../../api/endpoints";
import { Chat, User } from "../../../../interfaces/types.lib";
import UserChatItem from "../UserChatItem";
import { useChatContext } from "../../../../context/chatProvider";

const ContactsDrawer = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { apiData } = useApiRequest(AppConfig.endpoints.user, true);
  const { chatList,fetchChats, changeCurrentChat } = useChatContext();
  const { apiRequestService: accessUserChat } = useApiRequest()

  const getGroupedUsersList = (users: User[]) => {
    const obj: Record<string, User[]> = {};
    users?.forEach((user) => {
      const char = user.name.charAt(0).toUpperCase();
      if (!obj[char]) {
        obj[char] = [];
      }
      obj[char].push(user);
    });
    return obj;
  };

  const userList = useMemo(() => getGroupedUsersList(apiData), [apiData]);

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
    <>
      <div onClick={onOpen}>{children}</div>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        size={"sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <header className="pr-[20px] pl-[23px] flex flex-col justify-end bg-c-button-secondary h-[260px]">
            <Box className="h-[60px] flex items-center text-white">
              <div className="w-[53px] cursor-pointer" onClick={onClose}>
                <ArrowBackIcon w={6} h={6} />
              </div>
              <div className="flex-1 overflow-x-hidden text-h5 font-medium">
                New chat
              </div>
            </Box>
          </header>
          <Box
            className="h-[120px] w-full flex items-center border-b border-c-chat-border"
            boxShadow="0 2px 3px #0b141a14"
          >
            <div className="px-3 bg-white w-full flex items-center">
              <SearchInputBox placeholder="Search name or number" />
            </div>
          </Box>
          <Box className=" overflow-scroll">
            <Box className="h-[72px] overflow-hidden">
              <div className="pt-[30px] pb-[15px] pl-[32px] text-body-16 text-c-button-secondary">
                CONTACTS ON WHATSAPP
              </div>
            </Box>
            {Object.keys(userList).map((item) => (
              <>
                <Box className="h-[72px] overflow-hidden">
                  <div className="pt-[30px] pb-[15px] pl-[32px] text-body-16 text-c-button-secondary ">
                    {item}
                  </div>
                </Box>
                {userList?.[item]?.map((user) => (
                  <Box className="hover:bg-c-chat-border" onClick={()=>handleAccessChat(user.id)}>
                    <UserChatItem
                      avatarImageSrc={user?.pic}
                      content="Available"
                      chatName={user?.name}
                    />
                  </Box>
                ))}
              </>
            ))}
          </Box>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ContactsDrawer;
