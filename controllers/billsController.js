import Bills from "../models/billsModel.js";

//for add or fetch
export const getBillsController = async (req, res) => {
    try {

        const bills = (await Bills.find()).reverse();
        res.send(bills);

    } catch(error) {
        console.log(error);
    }
}

//for add
export const addBillsController = async (req, res) => {

    try {

        const newBills = new Bills(req.body);
        await newBills.save();
        res.send("Bill Created Successfully!");

    } catch(error) {
        console.log(error);
    }

}

export const getBillsCreatedToday = async (req,res)=>{
 try {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(currentDate);
    endDate.setHours(23, 59, 59, 999);

    const billsCreatedToday = await Bills.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        }
      });
      function calculateSubtotal(billsArray) {
        let subtotal = 0;
      
        billsArray.forEach(bill => {
          subtotal += bill.subTotal;
        });
      
        return subtotal;
      }
  
      const todaySubTotal = calculateSubtotal(billsCreatedToday);
      console.log('todaySubTotal', todaySubTotal);
  
      res.json({
        message: "Bill Created Successfully!",
        billsCreatedToday,
        todaySubTotal,
      });
  
 } catch (error) {
  console.log(error)  
 }





}