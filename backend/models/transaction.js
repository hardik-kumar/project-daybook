const mongoose = require('mongoose')

const transationSchema = mongoose.Schema({
    type: {type: String, required: true},
    desc: {type: String},
    amount: {type: Number, required: true},
    date: {type: Date, required: true},
    category: {type: String, required: true},
    tags: [{type: String}],
    amountExclusion: {type: Boolean, required: true},
    accountId: {type: Number, required: true}
    // "id": 1,
    //     "type": "income",
    //     "desc": "salary",
    //     "amount": 5000,
    //     "date": "26-08-2021",
    //     "category": "salary",
    //     "tags": ["salary","income"],
    //     "amountExclusion": false,
    //     "accountId": 1
})

module.exports = mongoose.model('Transaction',transationSchema)