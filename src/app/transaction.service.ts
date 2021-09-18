import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Transaction } from 'src/assets/model/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  getTransaction(){
    return this.http.get<any[]>('assets/json/transactions.json');
  }

  addBulkTransaction(bulkTransactions: Transaction[]){
    console.log("service saving obj",bulkTransactions);
    
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
    console.log("OBJ to backend",obj);
    
    return this.http.post('http://localhost:3000/api/transaction/addTransaction',obj)
  }

  updateTransaction(transactionId: string,transactionObj: Transaction){
    console.log("update transaction",transactionObj,"id: ",transactionId);
    return this.http.put<{message: string}>('http://localhost:3000/api/transaction/updateTransaction/'+transactionId,transactionObj)

  }

  allTransactions(accountId:number){
    console.log("acc id",accountId);
    
    return this.http.get<{message: string, allTransactions: Transaction[]}>('http://localhost:3000/api/transaction/allTransaction/'+accountId)
  }

  deleteTransaction(id: String){
    console.log("service deleted transaction id",id);
    
    return this.http.delete<{message:string}>('http://localhost:3000/api/transaction/deleteTransaction/'+id);
  }
}
