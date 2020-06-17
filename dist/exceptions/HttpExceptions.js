"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
exports.default = HttpException;
