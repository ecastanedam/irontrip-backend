// the following 3 packages are needed in order for cloudinary to run
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// your three cloudinary keys will be passed here from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// const storage = new CloudinaryStorage({
//   cloudinary,
//   folder: 'bananarama', // The name of the folder in cloudinary . You can name this whatever you want
//   allowedFormats: ['jpg', 'png'],
//   // params: { resource_type: 'raw' }, => add this is in case you want to upload other type of files, not just images
//   filename: function (req, res, cb) {
//     cb(null, res.originalname); // The file on cloudinary will have the same name as the original file name
//   }
// });

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "bananarama",
    allowed_formats: ["jpg", "png"],
    transformation: [
      {
        width: 600,
        height: 600,
        crop: "fill", // or 'limit' if I don't want to crop
        gravity: "auto",
        fetch_format: "auto",
        quality: "auto",
      },
    ],
  },
});

module.exports = multer({ storage });