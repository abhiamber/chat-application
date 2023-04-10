// import react from "react";
// import axios from "axios";
import { ChatState } from "../context/ChatProvider";

import { Box } from "@chakra-ui/react";
import MyChats from "../component/MyChats";
import ChatBox from "../component/ChatBox";
import SideDrwaer from "../component/SideDrwaer";
import { useState } from "react";

const ChatPages = () => {
  const { user } = ChatState();
  const [fetchChatsAgain, setfetchChatsAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrwaer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchChatsAgain={fetchChatsAgain} />}
        {user && (
          <ChatBox
            fetchChatsAgain={fetchChatsAgain}
            setfetchChatsAgain={setfetchChatsAgain}
          />
        )}
      </Box>
    </div>
  );
};

export default ChatPages;
