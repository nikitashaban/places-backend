"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Place = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const PlaceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    address: { type: String, required: true },
    creator: { type: mongoose_1.default.Types.ObjectId, required: true, ref: "User" },
});
exports.Place = mongoose_1.default.model("Place", PlaceSchema);
