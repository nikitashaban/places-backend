"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const users_controllers_1 = require("../controllers/users-controllers");
exports.router = express_1.Router();
exports.router.get("/", users_controllers_1.getUsers);
exports.router.post("/signup", [
    express_validator_1.check("name").not().isEmpty(),
    express_validator_1.check("email").normalizeEmail().isEmail(),
    express_validator_1.check("password").isLength({ min: 6 }),
], users_controllers_1.signup);
exports.router.post("/login", users_controllers_1.login);
