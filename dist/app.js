"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_error_1 = __importDefault(require("./models/http-error"));
const places_routes_1 = require("./routes/places-routes");
const users_routes_1 = require("./routes/users-routes");
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use("/api/users", users_routes_1.router);
app.use("/api/places", places_routes_1.router);
app.use((req, res, next) => {
    const error = new http_error_1.default(404, "Could not find this route");
    throw error;
});
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured" });
});
mongoose_1.default
    .connect("mongodb+srv://nikita:Nikita12345@cluster0-wi8ed.mongodb.net/places?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(5000))
    .catch((err) => console.log(err));
