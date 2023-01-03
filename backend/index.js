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
  allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined;
    callback(null, noOriginHeader);
  },
  cors: {
    origin: "http://localhost:3000/",
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
  console.log("connected");

  socket.on("setup", (userRoom) => {
    if (!userRoom) {
      return;
    }
    console.log(userRoom.id, "newconnected");
    socket.join(userRoom.id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(room, "connected");
  });

  socket.on("newMessage", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.map((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message Received", newMessageReceived);
    });
  });
});

const UserRoutes = require("./routes/user.routes");
const ChatRoutes = require("./routes/chat.route");
const MessageRouter = require("./routes/message.route");
const { connected } = require("process");

app.get("/", (req, res) => {
  // console.log("hello");

  return res.send("working fine................");
});

// app.get("/hello", (req, res) => {
//   console.log("hello");

//   return res.send("working fine hello................");
// });

app.get("/api/chat/:id", (req, res) => {
  const singlechat = chats.find((c) => c._id === req.params.id);
  return res.send(singlechat);
});

app.use("/user", UserRoutes);
app.use("/chat", ChatRoutes);
app.use("/message", MessageRouter);

app.use(notFound);
// app.use(errorHandler);

httpServer.listen(PORT, async (req, res) => {
  await connect();
  console.log("working");
});
