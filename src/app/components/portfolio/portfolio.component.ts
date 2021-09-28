import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TransactionService } from 'src/app/transaction.service';
import { AccountCategories, Portfolio } from 'src/assets/model/portfolio';
import { SideAccountDTO } from 'src/assets/model/sideAccount';
import { Transaction, UpdateTransactionDTO } from 'src/assets/model/transaction';
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
import { SideAccountComponent } from '../side-account/side-account.component';

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
export class PortfolioComponent implements OnInit{
  // @ViewChild('child') child: ChildComponent;
  // @ViewChild('sideComponent2') sideComponent: SideAccountComponent
  // @ViewChild("sideComponent2", { read: ViewContainerRef })
  // container: ViewContainerRef;
  @ViewChild('child', {static: false }) child: ElementRef ;
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
  accountCategories: AccountCategories[] = []
  accountCategoriesGlobal: AccountCategories[] = [{id: 1, name: 'ICICI'},{id: 2, name: 'PNB'}]

  addAccount(obj: AccountCategories){
    let index = this.accountCategories.indexOf(obj);
    console.log(index);
    this.portfolio.accountId.push(this.accountCategories[index].id);
    this.accountCategories.splice(index,1);
    
  }

  ngOnInit(): void {
    this.accountCategories = Object.assign([],this.accountCategoriesGlobal);
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
    if(this.portfolio.lendAccount.length > 0){
      
    }
    else{
    this.createSideAccounts(this.lendTransactions);
    }
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
      else{
        this.sideAccountDTO = [];    
        this.accountCategories = Object.assign([],this.accountCategoriesGlobal);
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
    console.log("sA ids",sideAccountIds);
    
    sideAccountIds.forEach((id,index) =>{
      this._service.getSideAccount(id).subscribe(async response =>{
        let sideAccount = response.sideAccount[0];
        // console.log("!! portfolio",sideAccount);

        //checking if we get side account on service call
        if(sideAccount){
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
        }
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
        // previousBalance: 100
      }
      sideAccountDmyDTO.push(obj);
    }
    this.sideAccountDTO = sideAccountDmyDTO;
    // console.log("obj",this.sideAccountDTO);
    
  }

  newSideAccountId(id: string){
    this.portfolio.lendAccount.push(id);
    console.log("!! p",this.portfolio);
    
    this.saveUpdatePortfolio(this.portfolio);
  }

  updateSideAccount(updatedTransation: {action: string, transaction: Transaction}){
    console.log("update id in portfolio",updatedTransation);

    //If we get proper response and action
    if(updatedTransation && updatedTransation.action){
      
      //Condtions for differnet actions
      if(updatedTransation.action == 'add'){
        console.log("Updating transaction",updatedTransation.transaction);
        let toBeUpdateSideAccount = this.sideAccountDTO.find(element => element.accountName == updatedTransation.transaction.tags[0]);

        //IF side account present
        if(toBeUpdateSideAccount){
          //Finding index of side account to update
          let index = this.sideAccountDTO.indexOf(toBeUpdateSideAccount);
          //Creating new sideaccount object
          //Pushing transaction into new side account object
          //Replacing the object using splice
          let sideAccountDTOObj : SideAccountDTO = {
            _id: toBeUpdateSideAccount._id,
            accountName: toBeUpdateSideAccount.accountName,
            previousId: toBeUpdateSideAccount.previousId,
            finalBalance: toBeUpdateSideAccount.finalBalance,
            month: toBeUpdateSideAccount.month,
            year: toBeUpdateSideAccount.year,
            transactions : toBeUpdateSideAccount.transactions
          }
          sideAccountDTOObj.transactions.push(updatedTransation.transaction);
          // this.sideAccountDTO.push(sideAccountDTOObj);
          this.sideAccountDTO.splice(index,1,sideAccountDTOObj);
          // document.getElementById('sideComponent2')!.runSaveSideAccount();
          let obj : UpdateTransactionDTO = {
            accountName: toBeUpdateSideAccount.accountName,
            action: 'update',
            transaction: updatedTransation.transaction
          }
          this._commonService.updateTransaction(obj);

        }
        //Adding transaction when side account is not present
        else{
          let sideAccountDTOObj : SideAccountDTO = {
            accountName: updatedTransation.transaction.tags[0],
            month: this.portfolio.month,
            year: this.portfolio.year,
            transactions : [updatedTransation.transaction]
          }
          this.sideAccountDTO.push(sideAccountDTOObj);
          let obj : UpdateTransactionDTO = {
            accountName: sideAccountDTOObj.accountName,
            action: 'save',
            transaction: updatedTransation.transaction
          }
          setTimeout(()=>{
            this._commonService.updateTransaction(obj);
          },3000)
        }
        console.log("UPDATE SIDE ACCOUNT",toBeUpdateSideAccount);
        console.log("SIDE ACCOUNT",this.sideAccountDTO);
        
      }
      //Save side account after transaction addition

      if(updatedTransation.action == 'update'){
        console.log("Updating transaction",updatedTransation.transaction);
        let toBeUpdateSideAccount = this.sideAccountDTO.find(element => element.accountName == updatedTransation.transaction.tags[0]);

        //IF side account present
        if(toBeUpdateSideAccount){
          //Finding index of side account to update
          let index = this.sideAccountDTO.indexOf(toBeUpdateSideAccount);
          //Creating new sideaccount object
          //Pushing transaction into new side account object
          //Replacing the object using splice
          let sideAccountDTOObj : SideAccountDTO = {
            _id: toBeUpdateSideAccount._id,
            accountName: toBeUpdateSideAccount.accountName,
            previousId: toBeUpdateSideAccount.previousId,
            finalBalance: toBeUpdateSideAccount.finalBalance,
            month: toBeUpdateSideAccount.month,
            year: toBeUpdateSideAccount.year,
            transactions : toBeUpdateSideAccount.transactions
          }
          let transactionIdex = sideAccountDTOObj.transactions.findIndex(element => element._id == updatedTransation.transaction._id)
          if(transactionIdex >= 0){
            sideAccountDTOObj.transactions.splice(transactionIdex,1, updatedTransation.transaction)
          }
          // sideAccountDTOObj.transactions.push(updatedTransation.transaction);
          // this.sideAccountDTO.push(sideAccountDTOObj);
          this.sideAccountDTO.splice(index,1,sideAccountDTOObj);
          let obj : UpdateTransactionDTO = {
            accountName: sideAccountDTOObj.accountName,
            action: 'update',
            transaction: updatedTransation.transaction
          }
          setTimeout(()=>{
            this._commonService.updateTransaction(obj);
          },3000)
        }
        //Adding transaction when side account is not present
        //this scenario might occur when editing transaction category is changed to 'Lend' 
        else{
          let sideAccountDTOObj : SideAccountDTO = {
            accountName: updatedTransation.transaction.tags[0],
            month: this.portfolio.month,
            year: this.portfolio.year,
            transactions : [updatedTransation.transaction]
          }
          this.sideAccountDTO.push(sideAccountDTOObj);

          let obj : UpdateTransactionDTO = {
            accountName: sideAccountDTOObj.accountName,
            action: 'save',
            transaction: updatedTransation.transaction
          }
          setTimeout(()=>{
            this._commonService.updateTransaction(obj);
          },3000)
        }
        console.log("UPDATE SIDE ACCOUNT",toBeUpdateSideAccount);
        console.log("SIDE ACCOUNT",this.sideAccountDTO);
        
        
      }

    }
  }

  saveUpdatePortfolio(portfolio: Portfolio){
    if(portfolio._id && portfolio._id != '' && portfolio._id != undefined){
      //UPDATE PORTFOLIO
      this._service.updatePortfolio(this.portfolio._id !, this.portfolio).subscribe(response =>{
        console.log("update portfolio response",response);
        
      })

    }
    else{
      //SAVE PORTFOLIO
      this.savePortfolio();
    }

  }
}
