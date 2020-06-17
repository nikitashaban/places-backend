import mongoose from "mongoose";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import { Place, IPlace } from "../models/place";
import { User } from "../models/user";
import { getCoordsForAddress } from "../util/location";
import HttpError from "../models/http-error";

export const getPlaceById: RequestHandler = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError(500, "Something went wrong, could not find a place")
    );
  }
  if (!place) {
    return next(new HttpError(404, "Could not find a place for provided id"));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

export const getPlacesByUserId: RequestHandler = async (req, res, next) => {
  const userId = req.params.userId;

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    return next(
      new HttpError(500, "Something went wrong, could not find a place")
    );
  }

  if (places.length === 0) {
    return next(
      new HttpError(404, "Could not find a place for provided user id")
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

export const createPlace: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(422, "Invalid inputs passed, please check your data")
    );
  }
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress();
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    coordinates,
    image:
      "https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg",
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError(500, "Creating place failed, please try again"));
  }

  if (!user) {
    return next(new HttpError(404, "Could not find user for provided id"));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError(500, "Creating place  failed, please try again"));
  }

  res.status(201).json({ place: createdPlace });
};

export const updatePlace: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(422, "Invalid inputs passed, please check your data")
    );
  }
  const placeId = req.params.placeId;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError(500, "Something went wrong, could not update a place")
    );
  }

  place!.title = title;
  place!.description = description;

  try {
    await place!.save();
  } catch (err) {
    return next(
      new HttpError(500, "Something went wrong, could not update a place")
    );
  }

  res.status(200).json({ place: place!.toObject({ getters: true }) });
};
export const deletePlace: RequestHandler = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place: any;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError(500, "Something went wrong, could not delete a place")
    );
  }
  if (!place) {
    return next(new HttpError(404, "Could not find place for this id"));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError(500, "Something went wrong, could not delete a place")
    );
  }

  res.status(200).json({ message: "Place deleted" });
};
