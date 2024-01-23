const File = require("../models/File");
const cloudinary = require("cloudinary").v2

// local file upload handler
exports.localFileUpload = async (req, res) => {
    try {

        // fetch file from req body
        const file = req.files.file
        // console.log("File data : ", file); 

        // stores file on local server 
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
        
        // move file to created folder
        file.mv(path, (err) => {
            err? console.log(err): null;
        })

        // send success res
        res.json({
            success: true,
            message: "Local file uploaded successfully"
        })
        
    }catch(e) {

        // in case of error
        console.log(e);
        res.status(400).json({
            success: false,
            message: "Local file upload failed"
        })

    }
};

// function to check type of the media
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

// function to upload media
async function uploadToCloudinary(file, folder, quality) {
    const options = {folder};

    // setting up quality if exist
    if(quality) {
        options.quality = quality;
    }

    // this is required so that videos can be idnetified
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async (req, res) => {
    try {

        // data fetching form req body
        const {name, tags, email}  = req.body;
        // console.log(name, tags, email)

        // fetching file from req
        const file = req.files.imageFile;

        // validate image
        const supportedTypes = [ "jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        // if filetype not supported
        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "FILE format not supported"
            })
        }

        // here file format is supported
        const response = await uploadToCloudinary(file, "assets");
        // console.log(response)
        
        // save entry to db
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl : response.secure_url
        })

        // success res
        return res.json({
            success: true,
            message: "Image uploaded successfully",
            url : response.secure_url
        })
        
    }
    catch(e) {

        // error
        console.log(e)       
        res.status(400).json({
            success: false,
            message: "Something went wrong!"
        })
    }
}

// video upload handler
exports.videoUpload = async (req, res) => {
    try {

        // fetch data 
        const { name, tags, email} = req.body;
        console.log(name, tags, email);

        // fetch file from req 
        const file = req.files.videoFile;

        // validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("file type : ", fileType)

        // upper limit of 5 mb on video size
        const fileSizeLimit = 20 * 1024 * 1024;
        if( file.size > fileSizeLimit || !isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: "FILE type not supported or the video is too large"
            })
        }

        // uploding to cloud
        const response = await uploadToCloudinary(file, "assets")
        // console.log(response)

        // create entry in db
        await File.create({
            name,
            email,
            tags,
            imageUrl: response.secure_url
        })

        // success res
        res.status(200).json({
            success: true,
            imageUrl: response.secure_url,
            message: "Video uploaded successfully!!!"
        }) 
    }
    catch(e) {

        // error 
        console.log(e)
        res.status(400).json({
            success: false,
            message : "Something went wrong"
        })
    }
}

exports.uploadReducedSizeImage = async (req, res) => {
    try {

        // data fetching form req body
        const {name, tags, email}  = req.body;
        console.log(name, tags, email)

        // fetching file from req
        const file = req.files.imageFile;

        // validate image
        const supportedTypes = [ "jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        // if file format not supported
        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "FILE format not supported"
            })
        }

        // here file format is supported
        const response = await uploadToCloudinary(file, "assets", 30);
        // console.log(response)
        
        // create entry in db
        await File.create({
            name,
            tags,
            email,
            imageUrl : response.secure_url
        })

        // success res
        return res.json({
            success: true,
            message: "Image uploaded successfully",
            url : response.secure_url
        })
        
    }
    catch(e) {

        // err
        console.log(e)       
        res.status(400).json({
            success: false,
            message: "Something went wrong!"
        })
    }
}