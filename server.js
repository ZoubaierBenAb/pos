import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRouter from "./routes/productsRoutes.js";
import userRouter from "./routes/userRoutes.js";
import billsRouter from "./routes/billsRoutes.js";
import products from "./utils/data.js";
import Product from "./models/productModel.js";
import { insertProdcuts } from "./utils/insert.js";
//require('colors');

dotenv.config();

//Connect with MongoDB

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
app.use("/api/products/", productRouter);
app.use("/api/users/", userRouter);
app.use("/api/bills/", billsRouter);

//Create Port
const PORT = process.env.PORT || 3001;

//Listen
mongoose
  .connect(
    "mongodb+srv://zoubaierbenab9779:0Lq8WxKRSPhKTJix@cluster0.gqsuijp.mongodb.net/"
  )
  .then(() => {
  
    app.listen(PORT, () => {
      console.log(`Server is running on the port: http://localhost:${PORT}`);
    });

  })
  .catch((err) => {
    console.log(err.message);
  });
