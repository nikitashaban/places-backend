"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const file_upload_1 = require("../middleware/file-upload");
const places_controllers_1 = require("../controllers/places-controllers");
const auth_check_1 = require("../middleware/auth-check");
exports.router = express_1.Router();
exports.router.get("/:placeId", places_controllers_1.getPlaceById);
exports.router.get("/user/:userId", places_controllers_1.getPlacesByUserId);
exports.router.use(auth_check_1.authCheck);
exports.router.post("/", file_upload_1.fileUpload.single('image'), [
    express_validator_1.check("title").not().isEmpty(),
    express_validator_1.check("description").isLength({ min: 6 }),
    express_validator_1.check("address").not().isEmpty(),
], places_controllers_1.createPlace);
exports.router.patch("/:placeId", [express_validator_1.check("title").not().isEmpty(), express_validator_1.check("description").isLength({ min: 5 })], places_controllers_1.updatePlace);
exports.router.delete("/:placeId", places_controllers_1.deletePlace);
