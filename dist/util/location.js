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
const http_error_1 = __importDefault(require("../models/http-error"));
exports.getCoordsForAddress = () => __awaiter(this, void 0, void 0, function* () {
    const coordinates = {
        lat: 44.952655,
        lng: 34.1050162,
    };
    if (!coordinates) {
        throw new http_error_1.default(422, "Could not find location for specified address");
    }
    return coordinates;
});
