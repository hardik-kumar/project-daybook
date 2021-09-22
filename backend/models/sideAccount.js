const mongoose = require('mongoose')

const sideAccountSchema = mongoose.Schema({
    accountName: {type: String, required: true},
    previousBalance: {type: Number, required: true},
    finalBalance: {type: Number, required: true},
    transactions: [{type: String}],
    previousId: {type: String},
    month: {type: Number, required: true},
    year: {type: Number, required: true}
})

module.exports = mongoose.model('SideAccount',sideAccountSchema)