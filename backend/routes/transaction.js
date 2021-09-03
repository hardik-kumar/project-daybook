const express = require('express');
const router = express();
const transactionController = require('../controller/transaction')
router.post("/addTransaction", transactionController.addTransaction)
router.get("/allTransaction", transactionController.allTransaction)
router.post("/addBulkTransaction",transactionController.addBulkTransaction)
router.delete('/deleteTransaction/:id',transactionController.deleteSingleTransaction)
module.exports = router;
