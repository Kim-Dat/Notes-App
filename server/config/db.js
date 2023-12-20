const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connect Database SuccessFully !!!");
    } catch (error) {
        console.log("Connect Database Rejected !!!");
    }
};
module.exports = connectDB;
