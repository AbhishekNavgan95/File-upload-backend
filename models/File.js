const mongoose = require("mongoose"); // instance of mongoose
const nodemailer = require("nodemailer") // instance of nodemailer

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    tags: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
})

// port middleware for sending mail
fileSchema.post("save", async (doc) => {
    try {
        console.log("doc", doc)
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // send mail
        let info = await transporter.sendMail({
            from: "hacker h bhai hacker hai!!!", 
            to: doc.email,
            subject: "New File uploaded on cloud",
            html: `<h1 align="center">File Uploaded</h1><h2 align="center">Your file has been uploaded successfully</h2><h2 align="center"><a  href="${doc.imageUrl}">See here</a></h2>`
        })

        console.log(info)

    }
    catch(e) {  
        console.error(e)
    }
})


module.exports = mongoose.model("File", fileSchema);