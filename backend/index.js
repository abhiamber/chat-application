require("dotenv").config();
const connect = require("./config/db");
const express = require("express");
const PORT = process.env.PORT || 5000;
const chats = require("./data/data");
const cors = require("cors");
const http = require("http");

// DB_URL=mongodb+srv://abhiamber:abhiamber@cluster0.5y3p60r.mongodb.net/?retryWrites=true&w=majority

// TOKEN_KEY=secretpassword

const app = express();
app.use(cors());
app.use(express.json());
const httpServer = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(httpServer, {
  pingTimeout: 60000,
  // allowRequest: (req, callback) => {
  //   const noOriginHeader = req.headers.origin === undefined;
  //   callback(null, noOriginHeader);
  // },
  cors: {
    origin: "*",
    method: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  },
});

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  return res.status(404).send(error);
  // next(error);
};

// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode);
//   res.json({
//     message: err.message,
//   });
// };

io.on("connection", (socket) => {

  socket.on("setup", (userRoom) => {
    if (!userRoom) {
      return;
    }
    console.log("sever set up done with your id", userRoom.id, userRoom.name);
    socket.join(userRoom.id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("join the partner room for chat", room);
  });


  socket.on("newMessage", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat?.users?.map((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message Received", newMessageReceived);
    });
  });


  socket.on("requested_video_call", ({ signal, selectedChat, dcoded }) => {
    selectedChat.users?.map((user) => {
      if (user._id === dcoded.id) {
        return;
      }
      socket.in(user._id).emit("video_call_request_coming", { signal, dcoded, selectedChat });
    });
  });

  socket.on("answered_video_call", ({ signal, selectedChat, dcoded }) => {
    selectedChat?.users.map((user) => {
      if (user._id === dcoded.id) {
        return;
      }
      socket.in(user._id).emit("connecting_video_call", { signal, dcoded, selectedChat });
    });
  });

  socket.on("request_to_end_video_call", (selectedChat) => {
    selectedChat?.users?.map((user) => {
      console.log("🚀 ~ selectedChat?.users?.map ~ user:", user._id)
      socket.in(user._id).emit("disconnect_video_call");
    });
  });


});

const UserRoutes = require("./routes/user.routes");
const ChatRoutes = require("./routes/chat.route");
const MessageRouter = require("./routes/message.route");

app.get("/", (req, res) => {
  return res.send("working fine................");
});

app.use("/user", UserRoutes);
app.use("/chat", ChatRoutes);
app.use("/message", MessageRouter);

app.use(notFound);
// app.use(errorHandler);

httpServer.listen(PORT, async (req, res) => {
  await connect();
  console.log("🚀 ~ httpServer.listen ~ listening :", PORT)
});
