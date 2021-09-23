import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Transaction } from 'src/assets/model/transaction';
import { Portfolio } from 'src/assets/model/portfolio';
import { SideAccount } from 'src/assets/model/sideAccount';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  getTransaction(){
    return this.http.get<any[]>('assets/json/transactions.json');
  }

  addBulkTransaction(bulkTransactions: Transaction[]){
    //console.log("service saving obj",bulkTransactions);
    
    return this.http.post('http://localhost:3000/api/transaction/addBulkTransaction',bulkTransactions)
  }
  addTransaction(transactionObj: Transaction){
    let obj = {
      type: transactionObj.type,
      desc: transactionObj.desc,
      amount: transactionObj.amount,
      date: transactionObj.date,
      category: transactionObj.category,
      tags: transactionObj.tags,
      amountExclusion : transactionObj.amountExclusion,
      accountId: transactionObj.accountId
    }
    //console.log("OBJ to backend",obj);
    
    return this.http.post('http://localhost:3000/api/transaction/addTransaction',obj)
  }

  updateTransaction(transactionId: string,transactionObj: Transaction){
    //console.log("update transaction",transactionObj,"id: ",transactionId);
    return this.http.put<{message: string}>('http://localhost:3000/api/transaction/updateTransaction/'+transactionId,transactionObj)

  }
  
  
  allTransactions(accountId:number){    
    return this.http.get<{message: string, allTransactions: Transaction[]}>('http://localhost:3000/api/transaction/allTransaction/'+accountId)
  }

  allTransactionByDate(searchObj: {accountId: number, month: string, year: string}){
    return this.http.put<{message: string, allTransactions: Transaction[]}>('http://localhost:3000/api/transaction/allTransaction/'+searchObj.accountId,searchObj);
  }
  //getBulkTransaction
  getBulkTransactions(transactions: string[]){
    return this.http.post<{message: string, allTransactions: Transaction[]}>('http://localhost:3000/api/transaction/getBulkTransaction',{transactions}).toPromise();
  }

  deleteTransaction(id: string){
    //console.log("service deleted transaction id",id);
    
    return this.http.delete<{message:string}>('http://localhost:3000/api/transaction/deleteTransaction/'+id);
  }

  deletePortfolio(id: string){
    return this.http.delete<{message: string}>('http://localhost:3000/api/portfolio/deletePortfolio/'+id);
  }
  getPorfolio(month: number, year: number){
    return this.http.put<{message: string, portfolio: Portfolio[]}>('http://localhost:3000/api/portfolio/getPortfolio',{month: month,year:year});
  }
  //getPortfolioById
  getPorfolioById(id: string){
    return this.http.get<{message: string, portfolio: Portfolio[]}>('http://localhost:3000/api/portfolio/getPortfolioById/'+id);
  }
  addPortfolio(portfolioObj: Portfolio){
    console.log("saving portfolio ",portfolioObj);
    return this.http.post('http://localhost:3000/api/portfolio/addPortfolio',portfolioObj);
  }

  addSideAccount(sideAccountObj: SideAccount){
    //console.log("saving side acc",sideAccountObj);
    return this.http.post<{message: string, id: string}>('http://localhost:3000/api/sideAccount/addSideAccount',sideAccountObj)
  }

  getSideAccount(id: string){
    return this.http.get<{message: string, sideAccount: SideAccount[]}>('http://localhost:3000/api/sideAccount/getSideAccount/'+id)
  }
  getPreviousSideAccount(accountName: string, month: number, year: number){
    let obj = {
      accountName: accountName,
      month: month,
      year: year
    }
    console.log("DATE obj",obj);
    
    return this.http.put<{message: string, sideAccount: SideAccount[]}>('http://localhost:3000/api/sideAccount/getPreviousSideAccount',obj)
  }
}
