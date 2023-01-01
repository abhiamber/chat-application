const express = require("express");
require("dotenv").config();

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const app = express.Router();
const UserModel = require("../model/user.model");
const ChatModel = require("../model/chat.model");

// ***************************single Chat  acess***************

app.post("/", async (req, res) => {
  const { user_Id } = req.body; ///userId of the user to whom we will send the data
  let userIdOfloggedIn = req.headers.token;
  let token = jwt.verify(userIdOfloggedIn, process.env.TOKEN_KEY);
  userIdOfloggedIn = token.id;
  // console.log("singlechat acees");

  if (!user_Id) {
    return res.send("there is no users to recived your message");
  }

  let isChat = await ChatModel.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: userIdOfloggedIn } } },
      { users: { $elemMatch: { $eq: user_Id } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await UserModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [user_Id, userIdOfloggedIn],
    };

    try {
      const createdChat = await ChatModel.create(chatData);
      const FullChat = await ChatModel.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

// ***************************fetch chats*******************************

app.get("/alltchatofLogedIn", async (req, res) => {
  let userIdOfloggedIn = req.headers.token;

  let token = jwt.verify(userIdOfloggedIn, process.env.TOKEN_KEY);
  userIdOfloggedIn = token.id;
  // console.log(userIdOfloggedIn);

  try {
    let user = await ChatModel.find({
      users: { $elemMatch: { $eq: userIdOfloggedIn } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        // console.log(user);
        res.status(200).send(results);
      });

    // res.status(200).send(user);
  } catch (error) {
    console.log(error.message);

    res.status(400);
    throw new Error(error.message);
  }
});

// ******************create grorp chat api****************************

app.post("/groupchat", async (req, res) => {
  let userIdOfloggedIn = req.headers.token;

  let token = jwt.verify(userIdOfloggedIn, process.env.TOKEN_KEY);
  userIdOfloggedIn = token.id;

  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);
  // console.log(users, userIdOfloggedIn);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  //   users.push(req.user);
  users.push(userIdOfloggedIn);

  try {
    const groupChat = await ChatModel.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      //   groupAdmin: req.user,
      groupAdmin: userIdOfloggedIn,
    });

    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//  ******************rename the group********************

app.put("/groupRename", async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    // console.log(updatedChat);
    res.json(updatedChat);
  }
});

// ******************add user to group********************

app.put("/addtogroup", async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

// ****************remove from the group**********************

app.put("/removefromthegrp", async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

module.exports = app;
