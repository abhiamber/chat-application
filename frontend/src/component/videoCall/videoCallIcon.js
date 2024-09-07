import { Box } from "@chakra-ui/react";
import React from "react";
import { CiVideoOn } from "react-icons/ci";
import { VideoCallState } from "../../context/VideoCallProvider";


const VideoCallIcon = ({ onClick = () => { } }) => {
    const {iseVideoCallStarted } = VideoCallState();

    return !iseVideoCallStarted && <Box onClick={onClick} m="2" cursor={"pointer"}>
        <CiVideoOn />
    </Box>

};

export default VideoCallIcon;
