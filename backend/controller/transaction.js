const Transaction = require('../models/transaction')

exports.addTransaction = (request, response, next) =>{

    console.log("BODY",request.body)
    url = request.protocol + "://" + request.get("host");
    let obj = new Transaction({
       type: request.body.type.value,
    desc: request.body.desc,
    amount: request.body.amount,
    date: request.body.date,
    category: request.body.category.value,
    tags: request.body.tags[0],
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
  exports.addBulkTransaction = (request, response, next) =>{

    console.log("BODY",request.body)
    url = request.protocol + "://" + request.get("host");
    let objectArr = [];
    for(let i = 0; i< request.body.length;i++){

      let tempObj = new Transaction({
        type: request.body[i].type,
     desc: request.body[i].desc,
     amount: request.body[i].amount,
     date: request.body[i].date,
     category: request.body[i].category,
     tags: request.body[i].tags[0],
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

    // const pageSize = +request.query.pagesize;
    // const currentPage = +request.query.page;
    const query = Transaction.find();
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