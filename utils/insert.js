import Product from "../models/productModel.js"
import products from "./data.js"

export const insertProdcuts = async()=>{
   
   try {
    await Product.create(products)
   } catch (error) {
    console.log(error)
   }
  
}

