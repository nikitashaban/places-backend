import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { User } from "../models/user";
import HttpError from "../models/http-error";

declare const process: {
  env: {
    DB_USER: string,
    DB_PASSWORD: string,
    DB_NAME: string,
    JWT_KEY: string

  }
}



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
    return next(new HttpError(422, "User exists already, please login instead"));
  }

  let hashedPassword
  try {
    hashedPassword = await bcryptjs.hash(password, 12)
  } catch (err) {
    return next(new HttpError(500, 'Could not create user'))
  }

  const createdUser = new User({
    name,
    password: hashedPassword,
    email,
    image: req.file.path,
    places: [],
  });
  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError(500, "Signing Up failed, please try again"));
  }

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, process.env.JWT_KEY, { expiresIn: '1h' })
  } catch (err) {
    return next(new HttpError(500, "Signing Up failed, please try again"));
  }


  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
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

  if (!existingUser) {
    return next(
      new HttpError(
        403,
        "Could not identify user, credentials seem to be wrong."
      )
    );
  }

  let isValidPassword
  try {
    isValidPassword = await bcryptjs.compare(password, existingUser.password)
  } catch (err) {
    return next(new HttpError(500, 'Could not identify user, because of wrong credentials'))
  }

  if (!isValidPassword) {
    return next(
      new HttpError(
        403,
        "Could not identify user, credentials seem to be wrong."
      )
    );
  }

  let token;
  try {
    token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.JWT_KEY, { expiresIn: '1h' })
  } catch (err) {
    return next(new HttpError(500, "Signing Up failed, please try again"));
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token: token });
};
