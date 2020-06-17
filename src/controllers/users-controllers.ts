import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { User } from "../models/user";
import HttpError from "../models/http-error";

export const getUsers: RequestHandler = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(
      new HttpError(500, "Fetching users failed, please try again later")
    );
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

export const signup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(422, "Invalid inputs passed, please check your data")
    );
  }
  const { name, password, email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError(500, "Signing up failed, please try again later")
    );
  }

  if (existingUser) {
    next(new HttpError(422, "User exists already, please login instead"));
  }

  const createdUser = new User({
    name,
    password,
    email,
    image:
      "https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg",
    places: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError(500, "Signing Up failed, please try again"));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

export const login: RequestHandler = async (req, res, next) => {
  const { password, email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError(500, "Logging in failed, please try again later")
    );
  }

  if (!existingUser || existingUser.password !== password) {
    return next(
      new HttpError(
        401,
        "Could not identify user, credentials seem to be wrong."
      )
    );
  }
  res.json({ message: "Logged in" });
};
