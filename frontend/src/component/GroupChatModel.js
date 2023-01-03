import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  FormControl,
  Input,
  useToast,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  // const [search, setSearch] = useState();
  const [searchResult, setSearchResults] = useState([]);
  const [loading, setLoading] = useState();
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  // search user********************

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          token: user.token,
        },
      };

      const { data } = await axios.get(
        `https://chat-application-d8vg.onrender.com/user?search=${query}`,
        config
      );
      setLoading(false);
      console.log(data);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // Selected users********************

  const handleGroup = (userToAdd) => {
    // console.log(userToAdd);

    for (let i = 0; i < selectedUsers.length; i++) {
      if (searchResult[i]._id === userToAdd._id) {
        return alert("user Added");
      }
    }
    // if (selectedUsers.includes(userToAdd)) {
    //   return alert("user Added");
    // }
    setSelectedUsers([...selectedUsers, { ...userToAdd }]);
  };

  // Create group chat*******************
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      return alert("please fill the required fields");
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          token: user.token,
        },
      };

      const { data } = await axios.post(
        `https://chat-application-d8vg.onrender.com/chat/groupchat`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      // console.log(data);

      setLoading(false);
      // console.log(data);
      setChats([...chats, data]);
      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // *************
  const handleDelete = (deletUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deletUser._id));
  };

  return (
    <div>
      {" "}
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent={"center"}>
            Create Group Chats
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir="column" alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={1}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add name i.e Abhishek"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box display={"flex"} w="100%" flexWrap={"wrap"}>
              {selectedUsers?.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                );
              })}
            </Box>

            <Box>
              {loading ? (
                <div> loading ....</div>
              ) : (
                searchResult?.slice(0, 4).map((user) => {
                  return (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  );
                })
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default GroupChatModel;
