const express = require('express');
const router = express();
const portfolioController = require('../controller/portfolio');

router.put("/getPortfolio", portfolioController.singlePortfolio);
router.post("/addPortfolio", portfolioController.addPortfolio)
router.delete('/deletePortfolio/:id',portfolioController.deletePortfolio)
module.exports = router;
