const asyncHandler = require("express-async-handler");
const User = require("../schemas/users.schema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const findUser = await User.findOne({ email: email });
    const findUsername = await User.findOne({ username: username });
    if (findUser) {
      res.status(404);
      throw new Error("Email already exists");
    }
    if (findUsername) {
      res.status(404);
      throw new Error("Username already exists");
    }
    const newPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: username,
      fullName: fullName,
      email: email,
      password: newPassword,
    });
    res.status(201).json({
      status: "User Created!",
    });
  } catch (error) {
    res.status(400);
    throw new Error("Email already exists!");
  }
});
//
//
//
//
const loginUser = asyncHandler(async (req, res) => {
  //   try {
  const user = await User.findOne({ email: req.body.email });
  // console.log(user);
  if (!user) {
    res.status(400);
    throw new Error("Email doesn't exist");
  }
  // console.log(req.body.password, `web`);
  // console.log(user.password, `back`);
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (validPassword) {
    const token = jwt.sign(
      {
        name: user.username,
        email: user.email,
      },
      "waefgqw4gqregrqegaergre"
    );

    return res.json({ status: "OK", token: token, user_id: user.id });
  } else {
    res.status(400);
    throw new Error("Wrong password");
  }
  //   } catch (error) {
  //     res.status(400);
  //     throw new Error("error");
  //   }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ users: req.body });
  res.status(200).json({ users: users });
});

const getUser = asyncHandler(async (req, res) => {
  c;
  const user = await User.findById(req.params.user_id);
  res.status(200).json({ user: user });
});

const putUser = asyncHandler(async (req, res) => {
  const { address, phoneNumber, img } = req.body;
  const user = User.findById(req.params.user_id);
  const { username, fullName, email, password } = req.body;
  console.log(req.body, "PUT");
  if (!user) {
    res.status(400);
    throw new Error("user doesn't exist");
  }
  const filter = {
    username: username,
    fullName: fullName,
    email: email,
    password: password,
  };
  let updateAddress;
  if (address) {
    updateAddress = [
      {
        city: address.city,
        street: address.street,
        postCode: address.postCode,
      },
    ];
  }
  let updatePhoneNumber;
  if (phoneNumber) updatePhoneNumber = phoneNumber;
  let updateImg;
  if (img) updateImg = img;
  const update = {
    address: updateAddress,
    phoneNumber: updatePhoneNumber,
    img: updateImg,
  };

  await User.findOneAndUpdate(filter, update, {
    new: true,
  });
  res.status(202).json({ status: "User details updated!" });
});

module.exports = { registerUser, loginUser, getUsers, getUser, putUser };
