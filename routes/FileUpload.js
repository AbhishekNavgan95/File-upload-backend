const express = require("express");
const router = express.Router();

// import handler
const { localFileUpload, imageUpload, videoUpload,uploadReducedSizeImage } = require("../controllers/fileUpload");

// mounting routes
router.post("/localFileUpload", localFileUpload);
router.post("/imageUpload", imageUpload);
router.post("/videoUpload", videoUpload);
router.post("/uploadReducedSizeImage", uploadReducedSizeImage);

module.exports = router;