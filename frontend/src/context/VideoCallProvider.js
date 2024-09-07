import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ChatState } from "./ChatProvider";
import Peer from 'simple-peer';



const VideoChatContext = createContext()

const VideoCallProvider = ({ children }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [iseVideoCallStarted, setIseVideoCallStarted] = useState(false)
    const [callDuration, setCallDuration] = useState(false)
    const { socketConnection, selectedChat, dcoded } = ChatState()
    const [remoteUserDetails, setRemoteUserDetails] = useState()

    const startVideoCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = stream;
            const localPeer = new Peer({
                initiator: true,
                trickle: false,
                stream: localVideoRef.current.srcObject,
            });
            setIseVideoCallStarted(true)
            localPeer.on('signal', (signal) => {
                socketConnection.emit("requested_video_call", { signal, selectedChat, dcoded })
            });

            localPeer.on('stream', (stream) => {
                setCallDuration(true)

                remoteVideoRef.current.srcObject = stream;
            });

            localPeer.on('error', (err) => {
                setIseVideoCallStarted(false)

                console.error("Peer error:", err);
            });

            setPeerConnection(localPeer);
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }

    const handleVideoCallRequest = async () => {
        const { signal: offer, selectedChat } = remoteUserDetails
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localVideoRef.current.srcObject = stream;
            const remotePeer = new Peer({
                initiator: false,
                trickle: false,
                stream: localVideoRef.current.srcObject,
            });

            remotePeer.signal(offer);

            remotePeer.on('signal', (signal) => {
                socketConnection.emit('answered_video_call', { signal, dcoded, selectedChat });
            });

            remotePeer.on('stream', (stream) => {
                setCallDuration(true)
                remoteVideoRef.current.srcObject = stream;
            });

            remotePeer.on('error', (err) => {
                setIseVideoCallStarted(false)
                console.error("Peer error: remotePeer", err);
            });

            setPeerConnection(remotePeer);
        }
        catch (error) {
            console.log("🚀 ~ handleVideoCallRequest ~ error:", error)

        }

    };

    const handleVideoCallConnection = (answer) => {
        try {
            if (peerConnection) {
                peerConnection.signal(answer);
            } else {
                console.error("No peer connection found to handle the answer.");
            }
        }
        catch (error) {
            console.log("🚀 ~ handleVideoCallConnection ~ error:", error)

        }

    };



    useEffect(() => {
        socketConnection?.on("video_call_request_coming", ({ signal, dcoded, selectedChat }) => {
            setRemoteUserDetails({ signal, dcoded, selectedChat })
        });

        socketConnection?.on("connecting_video_call", ({ signal, dcoded, selectedChat }) => {
            handleVideoCallConnection(signal);
        });

        socketConnection?.on("disconnect_video_call", () => {
            disconnectRemoteVideoCall();
        });


    }, [socketConnection, peerConnection]);

    const connectingVideoCall = () => {
        setIseVideoCallStarted(true)
        handleVideoCallRequest()

    }


    const endVideoCall = () => {
        socketConnection.emit('request_to_end_video_call', remoteUserDetails?.selectedChat ?? selectedChat);
        disconnectRemoteVideoCall()
    }
    const disconnectRemoteVideoCall = () => {
        setCallDuration(false)
        if (localVideoRef.current?.srcObject) {
            localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
        }

        if (remoteVideoRef.current?.srcObject) {
            remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            remoteVideoRef.current.srcObject = null;

        }
        if (peerConnection) {
            peerConnection?.destroy();
        }
        setPeerConnection(null);
        setIseVideoCallStarted(false);
        setCallDuration(false);
        setRemoteUserDetails(null);

    };





    return <VideoChatContext.Provider value={{ localVideoRef, remoteVideoRef, startVideoCall, iseVideoCallStarted, remoteUserDetails, connectingVideoCall, callDuration, endVideoCall }} >
        {children}</VideoChatContext.Provider>

}


export const VideoCallState = () => {
    return useContext(VideoChatContext)
}

export default VideoCallProvider;

