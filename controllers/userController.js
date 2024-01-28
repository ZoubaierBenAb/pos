import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

//for login
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

export const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId, password }).select("-password");
    if (user) {
      const token = signToken(user._id);
      res.status(200).json({ data: user, token });
    } else {
      res.json({
        message: "Login Fail",
        user,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//for register
export const registerController = async (req, res) => {
  try {
    const newUser = new User({ ...req.body, verified: true });
    await newUser.save();
    res.status(200).send("New User Added Successfully!");
  } catch (error) {
    console.log(error);
  }
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      message: "You are not logged in! Please log in to get access.",
    });
  }

  // token verification

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exist

  const user = await User.findById(decoded.userId);

  if (!user) {
    res.status(400).json({
      message: "User doesn't exist",
    });
  }

  // check if user changed their password after token was issued

  req.user = user;

  next();
};
