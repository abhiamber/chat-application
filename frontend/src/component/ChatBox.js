import React from "react";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchChatsAgain, setfetchChatsAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column "
      p={3}
      w={{ base: "100%", md: "68%" }}
      borderRadius="1g"
      borderWidth={"1px"}
    >
      <SingleChat
        fetchChatsAgain={fetchChatsAgain}
        setfetchChatsAgain={setfetchChatsAgain}
      />
    </Box>
  );
};

export default ChatBox;
