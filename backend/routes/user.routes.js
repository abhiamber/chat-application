const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const app = express.Router();
const UserModel = require("../model/user.model");

app.post("/signup", async (req, res) => {
  const { name, email, password, pic, isAdmin } = req.body;
  const user = await UserModel.findOne({ email });
  // console.log(user);

  if (user) {
    return res.send({ message: "user exists" });
  }

  const hash = await argon2.hash(password);

  try {
    let newUser = new UserModel({
      name,
      email,
      password: hash,
      pic,
      isAdmin,
    });

    await newUser.save();

    return res.status(201).send(newUser);
  } catch (e) {
    return res.status(403).send(e.message);
  }
});

// ***************login**********************

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // const hash = await argon2.hash(password);
  // console.log(hash, "ABHI");

  const user = await UserModel.findOne({ email });
  let checkPassword = await argon2.verify(user.password, password);
  // console.log(checkPassword);

  // if (!user || hash === user.password) {
  //       return res.status(401).send({ message: "Invalid Crediantialas" });
  // }

  try {
    if (!checkPassword) {
      return res.send({ message: "Invalid Crediantialas" });
    }
    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email, pic: user.pic },
      process.env.TOKEN_KEY,
      { expiresIn: "30 days" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email, pic: user.pic },
      process.env.TOKEN_KEY,
      { expiresIn: "28 days" }
    );
    // console.log(token);
    return res
      .status(200)
      .send({ meassage: "login succees", token, refreshToken });
  } catch (e) {
    return res.send(e.message);
  }
});

// ***************************search user   needs to protect this route will work later***************

app.get("/", async (req, res) => {
  const keyword = req.query.search;
  // console.log(keyword);
  // ? {
  //     $or: [
  //       { name: { $regex: req.query.search, $options: "i" } },
  //       { email: { $regex: req.query.search, $options: "i" } },
  //     ],
  //   }
  // : {};

  const users = await UserModel.find({
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ],
  });

  // console.log(users);
  return res.send(users);
});

module.exports = app;
