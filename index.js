// create app
const express = require("express");
const app = express();
// envirement vars
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// connecting to db and cloudinary
require("./config/database").connectToDB();
require("./config/cloudinary").cloudinaryConnect();

// middleweares
const fileUpload = require("express-fileupload");
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));

// mounting routes
const upload = require("./routes/FileUpload");
app.use("/api/v1", upload);

// starting server
app.listen(PORT, (req, res) => {
  console.log("app is running at port", PORT);
});
