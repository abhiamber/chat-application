import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { PiPhoneCallDuotone } from "react-icons/pi";
import { VideoCallState } from "../context/VideoCallProvider";

const CallNotificationMessage = () => {
    const { remoteUserDetails, connectingVideoCall, endVideoCall } = VideoCallState();
    return (
        <>
            {remoteUserDetails && (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    p={4}
                    w="100%"
                >
                    <Box >
                        <span style={{ fontWeight: '900', fontSize: '2-px' }} > {`${remoteUserDetails?.dcoded?.name}`}</span>

                        <span> is calling</span>
                    </Box>
                    <Box
                        display="flex"
                        gap={8}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <PiPhoneCallDuotone
                            onClick={connectingVideoCall}
                            cursor={'pointer'}
                            style={{ fontSize: '32px', color: 'green' }}
                        />
                        <Text
                            onClick={endVideoCall}
                            cursor={'pointer'}
                            style={{
                                fontSize: '20px', color: 'red',
                                backgroundColor: 'white',
                                borderRadius: '50px',
                                padding: '5px 10px 5px 10px',
                                fontWeight: '1000'
                            }}>end</Text>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default CallNotificationMessage;
