import mongoose from "mongoose";

//for create table into db
const billsSchema = new mongoose.Schema({

    
    subTotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    cartItems: { type: Array, required: true }

}, {
    //for date
    timestamps: true
});

const Bills = mongoose.model("Bills", billsSchema);
export default Bills;