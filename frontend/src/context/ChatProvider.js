import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  let [dcoded, setDecoded] = useState();

  const getToken = async () => {
    try {
      const token = user.token;
      const decode = jwt_decode(token);
      // console.log(decode);
      setDecoded(decode);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (user) {
      getToken();
    }
  }, [user]);

  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userDetail);

    if (!userDetail) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

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
