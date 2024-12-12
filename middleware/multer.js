import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();
const MAX_FILE_SIZE = 10 * 1024 * 1024; 
const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if(mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
    }
}
const multerHandler = async(err, req, res, next) => {
    
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        
        return res.status(413).json({
            status: 'fail',
            message: `Payload content length greater than maximum allowed: ${MAX_FILE_SIZE}`,
        });
    }

    if (err.message === 'Invalid file type. Only JPEG and PNG files are allowed.') {
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid file type. Only JPEG and PNG files are allowed.',
        });
    }
    next(err); 

}

export {
    upload,
    multerHandler
}