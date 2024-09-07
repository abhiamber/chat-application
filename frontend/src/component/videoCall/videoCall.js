import React from "react";
import Draggable from 'react-draggable';
import { VideoCallState } from "../../context/VideoCallProvider";
import { RxCrossCircled } from "react-icons/rx";
import { Text } from "@chakra-ui/react";


const VideoCall = () => {
    const { localVideoRef, remoteVideoRef, callDuration, endVideoCall, iseVideoCallStarted } = VideoCallState();

    return (
        <Draggable>
            <div
                style={{
                    position: 'fixed',
                    top: '10px',
                    left: '10px',
                    zIndex: 1000,
                }}
            >
                <div className="flex gap-2 p-2 bg-black bg-opacity-70 rounded-md">

                    <div>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className={`transition-all duration-300`}
                            style={{
                                height: '100%',
                                width: '100%',
                                border: `${callDuration ? '1px solid black' : ''}`,
                                borderRadius: '10px'
                            }} />
                        {!callDuration && iseVideoCallStarted && <Text
                            onClick={endVideoCall}
                            cursor={'pointer'}
                            style={{
                                fontSize: '20px', color: 'red', position: 'absolute',
                                backgroundColor: 'white',
                                borderRadius: '50px',
                                padding: '5px 10px 5px 10px',
                                right: '80%',
                                bottom: '33%',
                                fontWeight: '1000',
                                zIndex: '10001'

                            }}>end</Text>}
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`transition-all duration-300 w-20 h-20`}
                            style={{
                                height: '30%', 'width': '30%', position: 'relative',
                                bottom: '145px',
                                border: `${callDuration ? '2px solid black' : ''}`,
                                borderRadius: '10px'
                            }}
                        />
                    </div>

                    {callDuration && <Text
                        onClick={endVideoCall}
                        cursor={'pointer'}
                        style={{
                            fontSize: '20px', color: 'red', position: 'absolute',
                            backgroundColor: 'white',
                            borderRadius: '50px',
                            padding: '5px 10px 5px 10px',
                            right: '50%',
                            bottom: '28%',
                            fontWeight: '1000'

                        }}>end</Text>}
                </div>
            </div>
        </Draggable>
    );
};

export default VideoCall;
