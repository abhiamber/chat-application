import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Container,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import MessageBoxScroll from "./MessageBoxScroll";
import io from "socket.io-client";
let socket = io("https://chat-app-0c6p.onrender.com");
let selectedCompare;

const SingleChat = ({ fetchChatsAgain, setfetchChatsAgain }) => {
  const [message, setMessage] = useState([]);
  const [loadling, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat, setSelectedChat, user, dcoded } = ChatState();
  // console.log(selectedChat);

  let getSender = (loggedUser, users) => {
    // console.log(loggedUser, users);
    return users[0]._id === dcoded.id ? users[1].name : users[0].name;
  };

  let getSenderFull = (loggedUser, users) => {
    // console.log(loggedUser, users);
    return users[0]._id === dcoded.id ? users[1] : users[0];
  };

  const sendMessage = async (e) => {
    let config = {
      headers: {
        "content-type": "application/json",
        token: user.token,
      },
    };
    if (e.key === "Enter" && newMessage) {
      try {
        setNewMessage("");

        let { data } = await axios.post(
          "https://chat-app-0c6p.onrender.com/message/sendMessage",
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        socket.emit("newMessage", data);

        setMessage([...message, data]);
      } catch (e) {
        console.log(e);
        return alert("failed to send message");
      }
    }
  };

  const fetchAllMessageOfSelectedUser = async () => {
    if (!selectedChat) {
      return;
    }
    let config = {
      headers: {
        "content-type": "application/json",
        token: user.token,
      },
    };
    try {
      setLoading(true);
      let { data } = await axios.get(
        `https://chat-app-0c6p.onrender.com/message/getAllMessage/${selectedChat._id}`,
        config
      );
      // console.log(data);
      setLoading(false);
      setMessage(data);
      socket.emit("join chat", selectedChat._id);
      // fetchAllMessageOfSelectedUser();
    } catch (e) {
      // console.log(e);
      return alert("failed to send message");
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    fetchAllMessageOfSelectedUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    selectedCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.emit("setup", dcoded);
    socket.on("connected", () => {
      setSocketConnected(true);
      // selectedCompare = selectedChat;
    });
  }, [dcoded]);

  useEffect(() => {
    socket.on("message Received", (newMessageReceived) => {
      // console.log(selectedChat._id);

      if (
        !selectedCompare ||
        selectedCompare._id !== newMessageReceived.chat._id
      ) {
        setfetchChatsAgain(!fetchChatsAgain);
        //
      } else {
        setMessage([...message, newMessageReceived]);
      }
    });
  });
  // console.log(dcoded);
  return (
    <Container>
      {selectedChat ? (
        <Box>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb="3"
            px="2"
            w="100%"
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <Box display={"flex"} justifyContent="space-between">
                {getSender(user, selectedChat.users)}

                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </Box>
            ) : (
              <Box display={"flex"} justifyContent="space-between" w="100%">
                {selectedChat.chatName.toUpperCase()}

                <UpdateGroupChatModal
                  fetchChatsAgain={fetchChatsAgain}
                  setfetchChatsAgain={setfetchChatsAgain}
                  fetchAllMessageOfSelectedUser={fetchAllMessageOfSelectedUser}
                />
              </Box>
            )}
          </Text>

          <Box
            display={"flex"}
            flexDir="column"
            justifyContent={"flex-end"}
            p={3}
            w="100%"
            h="100%"
            borderRadius={"1g"}
            overflow="hidden"
          >
            {loadling ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignContent="center"
                margin={"auto"}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  width: "100%",
                  height: "60vh",
                }}
              >
                <MessageBoxScroll message={message} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                // variant={"filled"}
                bg="#E0E0E0"
                placeholder="Enter a Message..."
                onChange={typingHandler}
                value={newMessage}
                alignItems="baseline"
              />
            </FormControl>
          </Box>
        </Box>
      ) : (
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent="center"
          h="100%"
        >
          <Text fontSize={"3xl"} pb={3}>
            Please start Chating
          </Text>
        </Box>
      )}
    </Container>
  );
};

export default SingleChat;
