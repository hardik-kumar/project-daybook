const express = require('express')
const router = express()
const sideAccountController = require('../controller/sideAccount')

router.get('/getSideAccount/:id',sideAccountController.getSideAccount)
router.put('/getPreviousSideAccount',sideAccountController.getPreviousAccount)
router.post("/addSideAccount", sideAccountController.addSideAccount)
router.put("/updateSideAccount/:id",sideAccountController.updateSideAccount)
module.exports = router;