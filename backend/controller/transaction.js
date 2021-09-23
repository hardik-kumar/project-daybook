const { request, response } = require('express');
const Transaction = require('../models/transaction')
const moment= require('moment') 


exports.addTransaction = (request, response, next) =>{

    console.log("BODY",request.body);
    url = request.protocol + "://" + request.get("host");
    let obj = new Transaction({
       type: request.body.type,
    desc: request.body.desc,
    amount: request.body.amount,
    date: new Date((request.body.date).split("-").reverse().join("-")),
    category: request.body.category,
    tags: request.body.tags,
    amountExclusion: request.body.amountExclusion,
    accountId: request.body.accountId
    });

    console.log("BODY",obj)
    obj.save().then(record =>{
      response.status(200).json({
        message: "Success!!",
        // post: {
        //   ...record
        // },
        id: record._id
      });
    }).catch(error =>{
      console.log("errr",error);
      response.status(500).json({message:error});
    });
  }

exports.updateTransaction = (request, response, next) =>{
  // let imagePath = request.body.imagePath;
  // if(request.file){
  //   const url = request.protocol + "://" + request.get("host");
  //   imagePath = url + "/images/" + request.file.filename;
  // }
  console.log("HERE !!!");
  let obj = new Transaction({
    _id: request.params.id,
    type: request.body.type.value,
 desc: request.body.desc,
 amount: request.body.amount,
 date: request.body.date,
 category: request.body.category,
 tags: request.body.tags,
 amountExclusion: request.body.amountExclusion,
 accountId: request.body.accountId
 });
  Transaction.updateOne({_id: request.params.id},obj).then(res =>{
    if(res.n > 0) {
      response.status(200).json({message: "success"})
    }
    else {
      response.status(401).json({message: "unautherized"})
    }
  }).catch(error =>{
    response.status(500).json({message:"Unable to connect to server, posts not found"});
  })
}
  exports.addBulkTransaction = (request, response, next) =>{

    console.log("BODY",request.body)
    url = request.protocol + "://" + request.get("host");
    let objectArr = [];
    // date: new Date((request.body[i].date).split("-").reverse().join("-")),
    for(let i = 0; i< request.body.length;i++){

      let tempObj = new Transaction({
        type: request.body[i].type,
     desc: request.body[i].desc,
     amount: request.body[i].amount,
    date: new Date((request.body[i].date).split("-").reverse().join("-")),
    //  date: request.body[i].date,
     category: request.body[i].category,
     tags: request.body[i].tags,
     amountExclusion: request.body[i].amountExclusion,
     accountId: request.body[i].accountId
     });
      objectArr.push(tempObj)
    }
    console.log("SAVING OBJECTS",objectArr);
    
    // console.log("BODY",obj)
    
    // let objArr = [obj,obj2,obj3];
    Transaction.insertMany(objectArr).then(transactions => {
      response.status(200).json({message: "success"})
    }).catch(error => {
      console.log("ERRRRR",error);
      response.status(500).json({message:error});
    })
  }

  exports.allTransaction = (request, response, next) =>{
    console.log("ACC ID",request.params.accountId);
    var startDate = moment('2021-03-08').utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //req.params.startTime = 2016-09-25 00:00:00
    var endDate   = moment('2021-03-10').utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //req.params.endTime = 2016-09-25 01:00:00
    const query = Transaction.find({accountId : request.params.accountId});
    let allTransactions;
    // if(pageSize && currentPage){
    //   query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    // }
    query.then(document =>{
      allTransactions = document;
        return Transaction.count();
  
      }).then(count =>{
        response.status(200).json({
          message: "Success!",
          allTransactions: allTransactions
        })
      }).catch(error =>{
        response.status(500).json({message:"Unable to connect to server, post not fetched"});
      })
      }
  exports.getBulkTransaction = (request, response, next) => {
    let transactions = request.body.transactions;
    let obj = [];
    transactions.forEach(element => {
      obj.push(element);
    });
    console.log("OBJ",obj);
    const query = Transaction.find({_id: {$in : obj}});
    let allTransactions;
    query.then(document =>{
      allTransactions = document;
      return;
    }).then(() => {
      response.status(200).json({
        message: "Success!",
        allTransactions: allTransactions
      })
    }).catch(error =>{
      response.status(500).json({message:"Unable to connect to server, post not fetched"});
    })
  }
  exports.allTransactionByDate = (request, response, next) =>{
    // console.log("ACC ID",request.params.accountId);
    // console.log("monthyear",request.body.month,"  ",request.body.year);
    let mn = request.body.month;
    let year = (request.body.year).toString();
    let month = (mn < 10) ? '0' + mn.toString() : mn.toString();

    
    let lastDate = new Date(year.toString(),month.toString(),0).getDate();
    
    var startDate = moment(year+'-'+month+'-01').utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //req.params.startTime = 2016-09-25 00:00:00
    var endDate   = moment(year+'-'+month+'-'+lastDate).utcOffset('+0700').format("YYYY-MM-DDTHH:mm:ss.SSSZ"); //req.params.endTime = 2016-09-25 01:00:00
    
    const query = Transaction.find({accountId : request.params.accountId, date: {$gte: startDate, 
      $lt: endDate}});
    let allTransactions;

    query.then(document =>{
      allTransactions = document;
        return Transaction.count();
  
      }).then(count =>{
        response.status(200).json({
          message: "Success!",
          allTransactions: allTransactions
        })
      }).catch(error =>{
        response.status(500).json({message:"Unable to connect to server, post not fetched"});
      })
      }

      exports.deleteSingleTransaction = (request, response, next) =>{
        console.log("ID",request.params.id);
        Transaction.deleteOne({_id: request.params.id}).then(result =>{
          if(result.n > 0) {
            response.status(200).json({message:"Transaction deleted"});
          }
          else {
            response.status(401).json({message:"Unautherized to delete Transaction"});
          }
        }).catch(error =>{
          response.status(401).json({message:"Unable to connect to server"});
        })
      }