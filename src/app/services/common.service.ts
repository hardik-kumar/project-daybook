import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  possibleIncomeTypes : String[] = ["income"]
  possibleExpenseType : String[] = ["spend"]
  
  convertAmount(amount: number, type: String) : number{
    
    if( this.possibleIncomeTypes.indexOf(type.toString().trim().toLowerCase()) > -1){       
        return amount > 0 ? amount : (-amount);
    }
    else{
        return amount < 0 ? amount : (-amount);
    }
  }
}
