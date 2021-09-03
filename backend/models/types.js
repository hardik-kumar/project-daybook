const mongoose = require('mongoose');

const typeSchema = mongoose.Schema({
    typeId: {type: Number,require: true},
    value: {type: String, require: true}
})

module.exports = mongoose.model('Types',typeSchema)
// types = [{typeId : 1, value: "income"},