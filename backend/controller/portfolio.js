const Portfolio = require('../models/portfolio')

exports.singlePortfolio = (request, response, next) =>{
  console.log("BDY",request.body);
    const month = request.body.month;
    const year = request.body.year;
    const query = Portfolio.find({month : month});
    let portfolio;
    query.then(document =>{
      portfolio = document;
        return Portfolio.count();
      }).then(count =>{
        response.status(200).json({
          message: "Success!",
          portfolio: portfolio
        })
      }).catch(error =>{
        response.status(500).json({message:"Unable to connect to server, post not fetched"});
      })
      }

exports.portfolioById = (request, response, next) =>{

  const id = request.params.id;
  const query = Portfolio.find({_id: id});

  let portfolio;
  query.then(document =>{
    portfolio = document;
    return;
  }).then(() =>{
    response.status(200).json({
      message: 'success',
      portfolio: portfolio
    })
  }).catch(error => {
    response.status(500).json({message:"Unable to connect to server, post not fetched"});
  })
}   


exports.addPortfolio = (request, response, next) =>{

    // console.log("BODY",request.body)
    let obj = new Portfolio({
    month: request.body.month,
    year: request.body.year,
    accountId: request.body.accountId,
    lendAccount: request.body.lendAccount
    });

    // console.log("BODY",obj)
    obj.save().then(record =>{
      response.status(200).json({
        message: "Success!!",
        id: record._id
      });
    }).catch(error =>{
      response.status(500).json({message:error});
    });
  }

exports.deletePortfolio = (request, response, next) =>{
    Portfolio.deleteOne({_id: request.params.id}).then(result =>{
        if(result.n > 0) {
          response.status(200).json({message:"Portfolio deleted"});
        }
        else {
          response.status(401).json({message:"Unautherized to delete Portfolio"});
        }
      }).catch(error =>{
        response.status(401).json({message:"Unable to connect to server"});
      })
}