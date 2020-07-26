import multer from 'multer'

import { v4 as uuid } from 'uuid';


const MIME_TYPE_MAP: { [key: string]: string } = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}


export const fileUpload = multer({
    limits: { fileSize: 500000 },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './dist/uploads/images')
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype]
            cb(null, uuid() + '.' + ext)
        }
    }),
    fileFilter: (req, file, cb: any) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]
        let error = isValid ? null : new Error('Wrong mime type')
        cb(error, isValid)
    }
})

