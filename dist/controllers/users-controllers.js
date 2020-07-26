"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const http_error_1 = __importDefault(require("../models/http-error"));
exports.getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let users;
    try {
        users = yield user_1.User.find({}, "-password");
    }
    catch (err) {
        return next(new http_error_1.default(500, "Fetching users failed, please try again later"));
    }
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
});
exports.signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        return next(new http_error_1.default(422, "User exists already, please login instead"));
    }
    let hashedPassword;
    try {
        hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    }
    catch (err) {
        return next(new http_error_1.default(500, 'Could not create user'));
    }
    const createdUser = new user_1.User({
        name,
        password: hashedPassword,
        email,
        image: req.file.path,
        places: [],
    });
    try {
        yield createdUser.save();
    }
    catch (err) {
        return next(new http_error_1.default(500, "Signing Up failed, please try again"));
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId: createdUser.id, email: createdUser.email }, process.env.JWT_KEY, { expiresIn: '1h' });
    }
    catch (err) {
        return next(new http_error_1.default(500, "Signing Up failed, please try again"));
    }
    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
});
exports.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, email } = req.body;
    let existingUser;
    try {
        existingUser = yield user_1.User.findOne({ email: email });
    }
    catch (err) {
        return next(new http_error_1.default(500, "Logging in failed, please try again later"));
    }
    if (!existingUser) {
        return next(new http_error_1.default(403, "Could not identify user, credentials seem to be wrong."));
    }
    let isValidPassword;
    try {
        isValidPassword = yield bcryptjs_1.default.compare(password, existingUser.password);
    }
    catch (err) {
        return next(new http_error_1.default(500, 'Could not identify user, because of wrong credentials'));
    }
    if (!isValidPassword) {
        return next(new http_error_1.default(403, "Could not identify user, credentials seem to be wrong."));
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId: existingUser.id, email: existingUser.email }, process.env.JWT_KEY, { expiresIn: '1h' });
    }
    catch (err) {
        return next(new http_error_1.default(500, "Signing Up failed, please try again"));
    }
    res.json({ userId: existingUser.id, email: existingUser.email, token: token });
});
