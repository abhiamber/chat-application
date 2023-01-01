import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  // console.log(user);
  // sss;
  return (
    <Box
      px="2"
      py={1}
      m={1}
      mb={2}
      varient="solid"
      fontSize="12px"
      cursor="pointer"
      backgroundColor="teal"
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon pl={1} />
    </Box>
  );
};

export default UserBadgeItem;
