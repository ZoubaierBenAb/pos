import Bills from "../models/billsModel.js"
import Product from "../models/productModel.js"
import products from "./data.js"

export const insertProdcuts = async()=>{
   
   try {
    await Product.create(products)
   } catch (error) {
    console.log(error)
   }
  
}

export const updateProductsKey = async () => {
   try {
     const filter = { 'image' : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMHYPixNR-EyXiYuKQKys2AUiwQJVicM3IZw&usqp=CAU'};
     const update = { $set: { 'image': 'https://www.sourcedupays.com/wp-content/uploads/2018/08/famille-bouteilles-source-du-pays-2.png' } };
 
     const result = await Product.updateMany(filter, update);
     console.log(result);
   } catch (error) {
     console.error(error);
   }
 };

 export const categoryKeys = async()=>{



  try {
    // Use Mongoose to find all products
    const products = await Product.find();

    // Create an array to store unique category keys
    const uniqueCategories = [];

    // Loop through the products and extract unique category keys
    products.forEach(product => {
      if (!uniqueCategories.includes(product.category)) {
        uniqueCategories.push(product.category);
      }
    });

    // uniqueCategories now contains all unique category keys
    console.log(uniqueCategories);
  } catch (err) {
    console.error(err);
  }

 }

 export const deleteBillDocuments = async () => {
  try {
    await Bills.deleteMany({});
    console.log('All documents deleted successfully');
  } catch (err) {
    console.error(err);
  }
};