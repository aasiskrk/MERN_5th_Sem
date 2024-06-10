// Importing Express
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./database/database");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// Crearing an express app
const app = express();

//JSON Config
app.use(express.json());

//fileupload config
app.use(fileUpload());

//make a public folder access to outside
app.use(express.static("./public"));

//Cors config
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

//Configuration dotenv
dotenv.config();

//Connecting to database
connectDB();

// Defining the port
const PORT = process.env.PORT;

// Creating a Test Route or endpoint
app.get("/test", (req, res) => {
  res.send("test api is working ... !");
});

app.get("/test_new", (req, res) => {
  res.send("test new api is working ... !");
});

//configuring user Routes
app.use("/api/user", require("./routes/userRoutes"));

app.use("/api/product", require("./routes/productRoutes"));

// API URL
// http://localhost:5000/api/user/create

// Starting the server
app.listen(PORT, () => {
  console.log(`Server  is running on  port: ${PORT} 
// API URL
// http://localhost:5000/api/user/create`);
});

//Task 1 Controller - Routes - Index.js
//Make a productController .js
//Make a productRoutes.js
//link to index.js
//http://localhost:5000/api/product/create
//response: Product API is working.....!
