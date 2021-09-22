import { Injectable } from '@angular/core';
import { Transaction } from 'src/assets/model/transaction';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  possibleIncomeTypes : string[] = ["income"]
  possibleExpenseType : string[] = ["spend"]
  
  categoryIcons : {[category: string]: string} = {'Bills' :'bi bi-receipt',
  'EMI' :'bi bi-caret-right-fill',
  'Entertainment' :'bi bi-film',
  'Food & Drinks' :'fas fa-hamburger',
  'Fuel' :'fas fa-gas-pump',
  'Groceries' :'fas fa-carrot',
  'Health' :'fas fa-heartbeat',
  'Investment' :'fas fa-coins',
  'Lend' :'fas fa-hand-holding-usd',
  'Shopping' :'fas fa-shopping-cart',
  'Transfer' :'fa fa-exchange',
  'Travels' :'fas fa-plane-departure',
  'Others' :'fas fa-ellipsis-h',
   'Salary' : 'fas fa-money-check-alt',
  'Reward': 'fas fa-award',
   'Last Balance': 'fas fa-cash-register'}

  
  convertAmount(amount: number, type: string) : number{
    //console.log("!!!type",type);
    if( this.possibleIncomeTypes.indexOf(type.trim().toLowerCase()) > -1){       
        return amount > 0 ? amount : (-amount);
    }
    else{
        return amount < 0 ? amount : (-amount);
    }
  }

  categorizeTransactions(transactionObj : Transaction[]): {labels: string[],values:number[]}{

    let dmyMap: {[k: string]: Transaction[]} = {};
    transactionObj.forEach((element,index) => {
      if(! (element.category.toString() in dmyMap)){
        dmyMap[element.category.toString()] = [transactionObj[index]];
      }
      else {
         dmyMap[element.category.toString()].push(transactionObj[index])
      }
    })
    //console.log("!!! success",dmyMap);
    let value : number[] = []; 
    for (let key in dmyMap) {
      let amount = dmyMap[key].map(value => value.amount).reduce((accumulator, currentValue) => accumulator + currentValue);
      value.push(amount);
    }
    let keys = Object.keys(dmyMap)
    return {labels: keys, values: value}
  }
  //: {accountName: string[], transactions: Transaction[]}
  categorizeLendTransactions(transactions: Transaction[]): {[accountName:string]: Transaction[]}{
    let dmyMap: {[accountName:string]: Transaction[]} = {};
    transactions.forEach((element, index) => {
      if(! (element.tags[0].toString() in dmyMap)){
        dmyMap[element.tags[0].toString()] = [transactions[index]];
      }
      else{
        dmyMap[element.tags[0].toString()].push(transactions[index]);
      }
    })
    return dmyMap;
  }
}
