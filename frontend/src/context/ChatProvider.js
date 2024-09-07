import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { API } from "../API";
import io from "socket.io-client";


const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [socketConnection, setSocketConnection] = useState()
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  let [dcoded, setDecoded] = useState({});
  const [message, setMessage] = useState([]);


  const getToken = async () => {
    try {
      const token = user.token;
      const decode = jwt_decode(token);
      setDecoded(decode);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userDetail);

    if (!userDetail) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (user) {
      getToken();
    }
  }, [user]);

  useEffect(() => {
    const connection = io(API, {
      "force new connection": true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
    setSocketConnection(connection);
    connection.emit("setup", dcoded);
    connection.on("connected", (data) => {
    });
  }, [dcoded]);


  socketConnection?.on("message Received", (newMessageReceived) => {
    setMessage([...message, newMessageReceived]);
  });



  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        dcoded,
        setDecoded,
        socketConnection, message, setMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
