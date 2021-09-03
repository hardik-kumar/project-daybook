const { response, static } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require("path");
const transactionRoutes = require('./routes/transaction')
const app = express();

//  mongoose.connect("mongodb+srv://hardik_kumar46:Qwerty12@cluster0.md5a1.mongodb.net/node-angular?retryWrites=true&w=majority")
mongoose.connect("mongodb+srv://hardik_kumar46:"+ process.env.MONGO_PW+"@cluster0.md5a1.mongodb.net/daybook_test?retryWrites=true&w=majority")
.then(() => {
  console.log("database connected");
}).catch((error)=>{
  console.log("error in database",error);
});


app.use("/images",express.static(path.join("backend/images")))
app.use(bodyParser.json())
app.use((request, response, next) =>{
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Origin, X--Requested-With, Content-Type, Accept, Authorization");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
})

app.use('/api/transaction',transactionRoutes);
module.exports = app;
