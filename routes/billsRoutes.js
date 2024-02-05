import express from "express";
import { addBillsController, getBillsController, getBillsCreatedToday, updateBill } from "../controllers/billsController.js";

const billsRouter = express.Router();

billsRouter.post("/addbills", addBillsController);

billsRouter.get("/getbills", getBillsController);
billsRouter.get('/getTodaysBills',getBillsCreatedToday)
billsRouter.put('/updateBill',updateBill)
export default billsRouter;