const express = require("express");
require("dotenv").config();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

let MessageModel = require("../model/Message.model");
const UserModel = require("../model/user.model");
const ChatModel = require("../model/chat.model");

const app = express.Router();

// Create a message collectopn and for storing the message per chat ID********

app.post("/sendMessage", async (req, res) => {
  let userIdOfloggedIn = req.headers.token;
  let token = jwt.verify(userIdOfloggedIn, process.env.TOKEN_KEY);
  userIdOfloggedIn = token.id;

  const { content, chatId } = req.body;

  if (!content || !chatId) {
    // console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    var newMessage = await MessageModel.create({
      sender: userIdOfloggedIn,
      content: content,
      chat: chatId,
    });

    newMessage = await newMessage.populate("sender", "name pic");
    // console.log(newMessage);
    // console.log("****************************");
    newMessage = await newMessage.populate("chat");

    // console.log(newMessage);
    // console.log("****************************");
    newMessage = await UserModel.populate(newMessage, {
      path: "chat.users",
      select: "name pic email",
    });

    // console.log(newMessage);
    // console.log("****************************");

    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      latestMessage: newMessage,
    });

    res.json(newMessage);
  } catch (e) {
    return res.status(400).send(e.message);
    // throw new Error(e.message);
  }
});

// GEt all message of the logged user****************

app.get("/getAllMessage/:chatId", async (req, res) => {
  // console.log(req.params.chatId, "dnh");
  try {
    const messages = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    // console.log(messages);

    res.json(messages);
  } catch (error) {
    return res.status(400).send(e.message);
    // throw new Error(error.message);
  }
});

module.exports = app;
