import { Router } from "express";
import { check } from "express-validator";

import { fileUpload } from '../middleware/file-upload'
import { signup, getUsers, login } from "../controllers/users-controllers";

export const router = Router();

router.get("/", getUsers);

router.post(
  "/signup",
  fileUpload.single('image'),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);
