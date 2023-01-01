import React from "react";
import { ChatState } from "../context/ChatProvider";
// import ScrollableFeed from "react-scrollable-feed";

const MessageBoxScroll = ({ message }) => {
  const { dcoded } = ChatState();

  //   console.log(message);
  return (
    <div>
      {message &&
        message.map((item, i) => (
          <div
            key={i}
            style={{
              textAlign: dcoded.id === item.sender._id ? "right" : "left",

              color: dcoded.id === item.sender._id ? "black" : "white",
              fontSize: "20px",
              margin: "2px",
            }}
          >
            <span
              style={{
                wordWrap: "break-word",
                width: "10%",
                textAlign: "center",
                backgroundColor: "teal",
                borderRadius: "10px",
              }}
            >
              {" "}
              {item.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default MessageBoxScroll;
