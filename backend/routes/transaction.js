const express = require('express');
const router = express();
const transactionController = require('../controller/transaction')
router.post("/addTransaction", transactionController.addTransaction)
router.put("/updateTransaction/:id",transactionController.updateTransaction)
router.get("/allTransaction/:accountId", transactionController.allTransaction)
router.put("/allTransaction/:accountId", transactionController.allTransactionByDate)
router.post("/addBulkTransaction",transactionController.addBulkTransaction)
router.post("/getBulkTransaction",transactionController.getBulkTransaction)
router.delete('/deleteTransaction/:id',transactionController.deleteSingleTransaction)
module.exports = router;
