import { Box } from "@chakra-ui/react";
import EmptyChatSvg from "../../../ui/Icons/empty-chat.svg";

const EmptyChatBox = () => {
  return (
    <Box
      className="bg-c-panel-header-background w-full h-full flex justify-center"
      display={{ base: "none", md: "flex" }}
    >
      <div className="m-auto">
        <div>
          <span className="flex justify-center">
            <EmptyChatSvg />
          </span>
        </div>
        <div className="text-center">
          <div className="mt-[40px]">
            <h1 className="text-h3">Whatsapp Web</h1>
          </div>
          <div className="mt-4">
            Send and receive messages without keeping your phone online.
          </div>
        </div>
      </div>
    </Box>
  );
};

export default EmptyChatBox;
