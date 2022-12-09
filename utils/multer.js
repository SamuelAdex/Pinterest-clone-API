const multer = require('multer');
const path = require('path')
module.exports = multer({
    storage: multer.diskStorage({}),
    filename: (req, file, cb)=>{        
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }, 
    fileFilter: (req, file, cb)=>{
        let ext = path.extname(file.originalname);
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.gif' && ext !== '.svg'){
            cb(new Error("File type is not Supported"), false)
            return
        }
        cb(null, true)
    }
});