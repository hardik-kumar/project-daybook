const mongoose = require('mongoose')

const portfolioSchema = mongoose.Schema({

    month: {type: Number, required: true},
    year: {type: Number, required: true},
    accountId: [{type: Number}],
    lendAccount: [{type: String}]

})

module.exports = mongoose.model('Portfolio',portfolioSchema)