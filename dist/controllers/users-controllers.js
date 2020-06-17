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
const express_validator_1 = require("express-validator");
const user_1 = require("../models/user");
const http_error_1 = __importDefault(require("../models/http-error"));
exports.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let users;
    try {
        users = yield user_1.User.find({}, "-password");
    }
    catch (err) {
        return next(new http_error_1.default(500, "Fetching users failed, please try again later"));
    }
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
});
exports.signup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.default(422, "Invalid inputs passed, please check your data"));
    }
    const { name, password, email } = req.body;
    let existingUser;
    try {
        existingUser = yield user_1.User.findOne({ email: email });
    }
    catch (err) {
        return next(new http_error_1.default(500, "Signing up failed, please try again later"));
    }
    if (existingUser) {
        next(new http_error_1.default(422, "User exists already, please login instead"));
    }
    const createdUser = new user_1.User({
        name,
        password,
        email,
        image: "https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg",
        places: [],
    });
    try {
        yield createdUser.save();
    }
    catch (err) {
        return next(new http_error_1.default(500, "Signing Up failed, please try again"));
    }
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
});
exports.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const { password, email } = req.body;
    let existingUser;
    try {
        existingUser = yield user_1.User.findOne({ email: email });
    }
    catch (err) {
        return next(new http_error_1.default(500, "Logging in failed, please try again later"));
    }
    if (!existingUser || existingUser.password !== password) {
        return next(new http_error_1.default(401, "Could not identify user, credentials seem to be wrong."));
    }
    res.json({ message: "Logged in" });
});
