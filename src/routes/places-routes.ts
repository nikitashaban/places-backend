import { Router } from "express";
import { check } from "express-validator";

import { fileUpload } from '../middleware/file-upload';
import {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
} from "../controllers/places-controllers";
import { authCheck } from '../middleware/auth-check'

export const router = Router();

router.get("/:placeId", getPlaceById);
router.get("/user/:userId", getPlacesByUserId);

router.use(authCheck)

router.post(
  "/",
  fileUpload.single('image'),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 6 }),
    check("address").not().isEmpty(),
  ],
  createPlace
);
router.patch(
  "/:placeId",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  updatePlace
);
router.delete("/:placeId", deletePlace);
