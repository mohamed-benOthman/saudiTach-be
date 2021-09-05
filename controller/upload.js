const express =require('express');

const multer  = require('multer');
const  router = express.Router();
const DIR = './public/images';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 4
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

router.post('/', upload.single('file'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    res.status(200).json({profileImageUrl:url + '/images/' + req.file.filename})

})
module.exports=router
