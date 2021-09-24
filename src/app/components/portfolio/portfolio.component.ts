import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TransactionService } from 'src/app/transaction.service';
import { AccountCategories, Portfolio } from 'src/assets/model/portfolio';
import { SideAccountDTO } from 'src/assets/model/sideAccount';
import { Transaction } from 'src/assets/model/transaction';
import {FormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class PortfolioComponent implements OnInit {

  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    console.log(this.date.value.month());
    
    let newPortfolio : Portfolio = {
      month: this.date.value.month() + 1,
      year: 2021,
      accountId: [],
      lendAccount: []
    };
    this.portfolio = newPortfolio;
    this.getPortfolio(this.portfolio.month,this.portfolio.year);
    datepicker.close();
  }

  constructor(private _service: TransactionService, private _commonService: CommonService) { }
  portfolio : Portfolio = {
    month: 9,
    year: 2021,
    accountId: [],
    lendAccount: []
  };
  lendTransactions : Transaction[] = [];
  sideAccountDTO: SideAccountDTO[] = [];
  accountCategories: AccountCategories[] = [{id: 1, name: 'ICICI'},{id: 2, name: 'PNB'}]

  addAccount(obj: AccountCategories){
    let index = this.accountCategories.indexOf(obj);
    console.log(index);
    this.portfolio.accountId.push(this.accountCategories[index].id);
    this.accountCategories.splice(index,1);
    
  }

  ngOnInit(): void {
    this.portfolio.month = (new Date().getMonth() + 1);
    this.portfolio.year = (new Date().getFullYear());
    this.getPortfolio(this.portfolio.month, this.portfolio.year);
    
    // this.getPortfolioById('');
    //console.log("MONTH ",new Date().getMonth() + 1);
    //console.log("MONTH ",new Date().getFullYear());
    
  }
  inLendTransactions(lendTransactionEvent: Transaction[]){
    lendTransactionEvent.forEach(element => {
      this.lendTransactions.push(element)
    });
    //console.log("incoming lend transactions ",this.lendTransactions);
    // this.getPortfolio();
    // this.createSideAccounts(this.lendTransactions);
  }

  getPortfolio(month: number, year: number){
    this._service.getPorfolio(month,year).subscribe(response =>{
      console.log("!!! portfolio",response);
      //if we get portfolio
      if(response.portfolio.length > 0){
        this.portfolio = response.portfolio[0];
        console.log("!!!portfolio",this.portfolio);
        //Creating the side accounts from fetched portfolio
        this.getSideAccounts(this.portfolio.lendAccount);
        //remove add account categories
        
        this.portfolio.accountId.forEach(id =>{
          let index = this.accountCategories.findIndex(obj => obj.id == id);
          if(index) {
            console.log(this.accountCategories.splice(index,1));
            
          }
        })
      }

    })
  }

  getPortfolioById(id: string){
    id = '614c0a8c53d8051f68f93860'
    this._service.getPorfolioById(id).subscribe(response =>{
        this.portfolio = response.portfolio[0];
        // console.log("!! portfolio",this.portfolio);
        this.getSideAccounts(this.portfolio.lendAccount);
      })

  }

  savePortfolio(){

    let obj : Portfolio = {
      month: this.portfolio.month,
      year: this.portfolio.year,
      accountId : this.portfolio.accountId,
      lendAccount: this.portfolio.lendAccount
    }
    this._service.addPortfolio(obj).subscribe(response => {
      // console.log("RESPONSE !!!",response);
      
    })
  }
  deletePortfolio(){
    let id: string = this.portfolio._id !;
    this._service.deletePortfolio(id).subscribe(response => {
      //console.log("RESPONSE !!!",response);
    })
  }

  async getBulkTransactions(transactions: string[]): Promise<Transaction[]>{
    let obj: Transaction[]= [];
    // console.log("!! portfolio tr",transactions);
    
    if(transactions){
      let obj2 = await this._service.getBulkTransactions(transactions)
      obj = obj2.allTransactions
 }
    return obj;
  }
  getSideAccounts(sideAccountIds: string[]){
    sideAccountIds.forEach((id,index) =>{
      this._service.getSideAccount(id).subscribe(async response =>{
        let sideAccount = response.sideAccount[0];
        // console.log("!! portfolio",sideAccount);
        
        let transaction: Transaction[] = await this.getBulkTransactions(sideAccount.transactions)
        
        let obj = {
          _id: sideAccount._id,
          accountName: sideAccount.accountName,
          transactions: transaction,
          previousId: sideAccount.previousId,
          month: sideAccount.month,
          year: sideAccount.year,
          previousBalance: sideAccount.previousBalance
        }
        // console.log("!! portfolio",obj);
        
        this.sideAccountDTO.push(obj);
      })
    })
  }
  createSideAccounts(lendTransactions: Transaction[]){
    // console.log(lendTransactions);
    let map = this._commonService.categorizeLendTransactions(lendTransactions);
    // console.log("map",map);
    let sideAccountDmyDTO: SideAccountDTO[] = [];
    for(let key in map){
      let obj = {
        accountName: key,
        transactions: map[key],
        previousId: '',
        month: this.portfolio.month,
        year: this.portfolio.year,
        previousBalance: 100
      }
      sideAccountDmyDTO.push(obj);
    }
    this.sideAccountDTO = sideAccountDmyDTO;
    // console.log("obj",this.sideAccountDTO);
    
  }

  newSideAccountId(id: string){
    this.portfolio.lendAccount.push(id);
  }
}
