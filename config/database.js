const mongoose = require("mongoose");
require("dotenv").config();

exports.connectToDB = async() => {
    // connect to db
    mongoose.connect(process.env.DB_URL, {})
    .then(() => {
        // id success
        console.log("connected to DB")
    }) 
    .catch((e) => {
        // if error
        console.log(e); 
        console.log("cannot connect to DB")
        process.exit(1);
    })
}