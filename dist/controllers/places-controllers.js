"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_validator_1 = require("express-validator");
const place_1 = require("../models/place");
const user_1 = require("../models/user");
const location_1 = require("../util/location");
const http_error_1 = __importDefault(require("../models/http-error"));
exports.getPlaceById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const placeId = req.params.placeId;
    let place;
    try {
        place = yield place_1.Place.findById(placeId);
    }
    catch (err) {
        return next(new http_error_1.default(500, "Something went wrong, could not find a place"));
    }
    if (!place) {
        return next(new http_error_1.default(404, "Could not find a place for provided id"));
    }
    res.json({ place: place.toObject({ getters: true }) });
});
exports.getPlacesByUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const userId = req.params.userId;
    let places;
    try {
        places = yield place_1.Place.find({ creator: userId });
    }
    catch (err) {
        return next(new http_error_1.default(500, "Something went wrong, could not find a place"));
    }
    if (places.length === 0) {
        return next(new http_error_1.default(404, "Could not find a place for provided user id"));
    }
    res.json({
        places: places.map((place) => place.toObject({ getters: true })),
    });
});
exports.createPlace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.default(422, "Invalid inputs passed, please check your data"));
    }
    const { title, description, address, creator } = req.body;
    let coordinates;
    try {
        coordinates = yield location_1.getCoordsForAddress();
    }
    catch (error) {
        return next(error);
    }
    const createdPlace = new place_1.Place({
        title,
        description,
        address,
        coordinates,
        image: "https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg",
        creator,
    });
    let user;
    try {
        user = yield user_1.User.findById(creator);
    }
    catch (err) {
        return next(new http_error_1.default(500, "Creating place failed, please try again"));
    }
    if (!user) {
        return next(new http_error_1.default(404, "Could not find user for provided id"));
    }
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        yield user.save({ session: sess });
        yield sess.commitTransaction();
    }
    catch (err) {
        return next(new http_error_1.default(500, "Creating place  failed, please try again"));
    }
    res.status(201).json({ place: createdPlace });
});
exports.updatePlace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.default(422, "Invalid inputs passed, please check your data"));
    }
    const placeId = req.params.placeId;
    const { title, description } = req.body;
    let place;
    try {
        place = yield place_1.Place.findById(placeId);
    }
    catch (err) {
        return next(new http_error_1.default(500, "Something went wrong, could not update a place"));
    }
    place.title = title;
    place.description = description;
    try {
        yield place.save();
    }
    catch (err) {
        return next(new http_error_1.default(500, "Something went wrong, could not update a place"));
    }
    res.status(200).json({ place: place.toObject({ getters: true }) });
});
exports.deletePlace = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const placeId = req.params.placeId;
    let place;
    try {
        place = yield place_1.Place.findById(placeId).populate("creator");
    }
    catch (err) {
        return next(new http_error_1.default(500, "Something went wrong, could not delete a place"));
    }
    if (!place) {
        return next(new http_error_1.default(404, "Could not find place for this id"));
    }
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield place.remove({ session: sess });
        place.creator.places.pull(place);
        yield place.creator.save({ session: sess });
        yield sess.commitTransaction();
    }
    catch (err) {
        return next(new http_error_1.default(500, "Something went wrong, could not delete a place"));
    }
    res.status(200).json({ message: "Place deleted" });
});
