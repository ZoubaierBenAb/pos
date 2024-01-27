import express from "express";
import { addBillsController, getBillsController, getBillsCreatedToday } from "../controllers/billsController.js";

const billsRouter = express.Router();

billsRouter.post("/addbills", addBillsController);

billsRouter.get("/getbills", getBillsController);
billsRouter.get('/getTodaysBills',getBillsCreatedToday)

export default billsRouter;