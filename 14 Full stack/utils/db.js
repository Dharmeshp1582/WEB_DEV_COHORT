import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

// export a function that connects to db

const db = async() => {
  try{
  await  mongoose
    .connect(process.env.MONGODB_URI)
    console.log("Mongodb connected successfully..")
   } catch{
      console.log("Error connecting to mongodb");

    };
};

export default db;
