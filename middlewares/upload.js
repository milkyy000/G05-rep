const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});
// Middleware function for handling file uploads and filtering file formats(called in routes/index.js)
const handleFileUploadError = (req,res,next) =>{
    const uploadImg = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpeg|JPG|png/;
            const mimeType = fileTypes.test(file.mimetype);
            const extname = fileTypes.test(path.extname(file.originalname));
        
            if (mimeType && extname) {
                // If the file format is allowed, accept the file
                return cb(null, true);
            }
            //Custom error message
            return cb(new Error('Invalid file type. Please choose jpeg/JPG/png'));
            // If the file format is not allowed, render the signup page with an error message
            // res.render("profile_editor", { message: "Check the file format and size below 5kb"});
        },
        limits: {
            fileSize: 1024 * 1024 * 5
        }
    }).single('image');
    
    uploadImg(req,res,(err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
              // Handle Multer-specific errors
              if (err.code === 'LIMIT_FILE_SIZE') {
                // Custom error handling for file size limit exceeded
                return res.render('profile_editor', { message: 'File size is too large. Please upload an image smaller than 500 KB.' });
              }
            } else if (err) {
              // Handle other errors
              return res.render('profile_editor', { message: err.message });
            }
          }
          // If no errors, proceed to the next middleware
          next();
    });
};
module.exports = handleFileUploadError;