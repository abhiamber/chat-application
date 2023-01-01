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
  // console.log(user);
  // const getToken = async () => {
  //   if (!user) {
  //     return;
  //   }
  //   try {
  //     const token = user.token;
  //     const decode = jwt_decode(token);
  //     console.log(decode);
  //     setDecoded(decode);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // useEffect(() => {
  //   getToken();
  // }, [user]);

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
