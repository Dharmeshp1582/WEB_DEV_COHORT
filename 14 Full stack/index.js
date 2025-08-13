import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";

//import all routes
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Full stack Cohort!");
});

app.get("/dharmesh", (req, res) => {
  res.send("dharmesh");
});

app.get("/Patel", (req, res) => {
  res.send("Patel Bhaiii !");
});

//connect to db
db();

//user routes
app.use("/api/v1/users/", userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
