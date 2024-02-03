import express from "express";
import { getProductController, addProductController, updateProductController, deleteProductController, getSelectProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/getproducts", getProductController);

productRouter.post("/addproducts", addProductController);

productRouter.put("/updateproducts", updateProductController);

productRouter.post("/deleteproducts", deleteProductController);

productRouter.get('/getSelectProducts/:category',getSelectProduct)



export default productRouter;