const express = require('express');
const router = express();
const portfolioController = require('../controller/portfolio');

router.put("/getPortfolio", portfolioController.singlePortfolio);
router.get('/getPortfolioById/:id',portfolioController.portfolioById)
router.post("/addPortfolio", portfolioController.addPortfolio)
router.delete('/deletePortfolio/:id',portfolioController.deletePortfolio)
router.put("/updatePortfolio/:id",portfolioController.updatePortfolio)

module.exports = router;
