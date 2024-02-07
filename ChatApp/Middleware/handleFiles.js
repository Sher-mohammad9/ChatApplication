const multer = require("multer");
const path = require("path")

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.resolve(__dirname, "../public/images"))
    },
    filename : function(req, file, cb){
        let fileName = Date.now()+"-"+file.originalname;
        cb(null, fileName) 
    }
});
exports.handleFiles = multer({storage : storage}).single("profileImage")