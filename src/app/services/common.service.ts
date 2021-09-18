import { Injectable } from '@angular/core';
import { Transaction } from 'src/assets/model/transaction';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  possibleIncomeTypes : String[] = ["income"]
  possibleExpenseType : String[] = ["spend"]
  
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
  'Reward': 'fas fa-award'}

  
  convertAmount(amount: number, type: String) : number{
    console.log("!!!type",type);
    if( this.possibleIncomeTypes.indexOf(type.toString().trim().toLowerCase()) > -1){       
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

    console.log("!!! success",dmyMap);
    let value : number[] = []; 
    for (let key in dmyMap) {
      let amount = dmyMap[key].map(value => value.amount).reduce((accumulator, currentValue) => accumulator + currentValue);
      value.push(amount);
    }
    let keys = Object.keys(dmyMap)

    return {labels: keys, values: value}
  }
}
