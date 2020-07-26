import { RequestHandler } from "express";
import jwt from 'jsonwebtoken'

import HttpError from '../models/http-error'

declare const process: {
    env: {
        DB_USER: string,
        DB_PASSWORD: string,
        DB_NAME: string,
        JWT_KEY: string

    }
}


declare global {
    namespace Express {
        interface Request {
            userData: any
        }
    }
}
export const authCheck: RequestHandler = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            throw new Error('Authorization failed')
        }
        const decodedToken: any = jwt.verify(token, process.env.JWT_KEY)
        req.userData = { userId: decodedToken.userId }
        next()
    } catch (err) {
        return next(new HttpError(403, 'Authorization failed'))
    }

}