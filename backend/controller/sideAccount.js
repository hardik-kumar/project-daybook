const { request } = require('express')
const SideAccount = require('../models/sideAccount')

exports.getSideAccount = (request, response, next) =>{
    const id = request.params.id;
    const query = SideAccount.find({_id: id});
    let sideAccount;
    query.then(document =>{
        sideAccount = document;
        return SideAccount.count();
    }).then(count =>{
        response.status(200).json({
          message: "Success!",
          sideAccount: sideAccount
        })
    }).catch(error =>{
        response.status(500).json({message:"Unable to connect to server, post not fetched"});
    })
}

exports.getPreviousAccount = (request, response, next) =>{
    // const id = request.params.id;
    // console.log("BODY",request.body);
    const month = request.body.month;
    const year = request.body.year;
    const accountName = request.body.accountName;
    const query = SideAccount.find({accountName: accountName, month: month, year: year});
    let sideAccount;
    query.then(document =>{
        sideAccount = document;
        return SideAccount.count();
    }).then(count =>{
        response.status(200).json({
          message: "Success!",
          sideAccount: sideAccount
        })
    }).catch(error =>{
        response.status(500).json({message:"Unable to connect to server, post not fetched"});
    })
}

exports.addSideAccount = (request, response, next) =>{
    let obj = new SideAccount({
        accountName: request.body.accountName,
        previousBalance: request.body.previousBalance,
        finalBalance: request.body.finalBalance,
        transactions: request.body.transactions,
        previousId: request.body.previousId,
        month: request.body.month,
        year: request.body.year
    });

    obj.save().then(record => {
        response.status(200).json({
            message: "Success!!",
            id: record._id
        })
    }).catch(error =>{
        response.status(500).json({message:error});
      });
}