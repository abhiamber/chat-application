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
import { API } from "../API";
import VideoCall from './videoCall/videoCall'
import VideoCallIcon from "./videoCall/videoCallIcon";
import { VideoCallState } from "../context/VideoCallProvider";
import CallNotificationMessage from "./callComingNotification";
import CallTime from "./videoCall/callTimer";


const SingleChat = ({ fetchChatsAgain, setfetchChatsAgain }) => {
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { selectedChat, setSelectedChat, user, dcoded, socketConnection, message, setMessage } = ChatState();
  const { startVideoCall, callDuration, iseVideoCallStarted } = VideoCallState();


  let getSender = (loggedUser, users) => {
    return users[0]._id === dcoded.id ? users[1].name : users[0].name;
  };

  let getSenderFull = (loggedUser, users) => {
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
          `${API}/message/sendMessage`,
          { content: newMessage, chatId: selectedChat._id },
          config
        );

        socketConnection.emit("newMessage", data);

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
        `${API}/message/getAllMessage/${selectedChat._id}`,
        config
      );
      setLoading(false);
      setMessage(data);
      socketConnection.emit("join chat", selectedChat._id);
    } catch (e) {
      return alert("failed to send message");
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    fetchAllMessageOfSelectedUser();
  }, [selectedChat]);


  return (
    <Container>
      {!iseVideoCallStarted && <CallNotificationMessage />}

      {callDuration && <CallTime />}
      <VideoCall />

      {
        selectedChat ? (
          <Box>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb="3"
              px="2"
              w="100%"
              display={"flex"}
              justifyContent={"space-around"}
              alignItems="center"
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />

              {!selectedChat.isGroupChat ? (
                <Box display={"flex"} justifyContent="space-between" gap={2}>
                  {getSender(user, selectedChat.users)}
                  <VideoCallIcon onClick={startVideoCall} />
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
              {loading ? (
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
