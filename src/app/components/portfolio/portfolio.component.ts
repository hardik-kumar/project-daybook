import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TransactionService } from 'src/app/transaction.service';
import { Portfolio } from 'src/assets/model/portfolio';
import { SideAccountDTO } from 'src/assets/model/sideAccount';
import { Transaction } from 'src/assets/model/transaction';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  constructor(private _service: TransactionService, private _commonService: CommonService) { }
  portfolio : Portfolio = {
    month: 9,
    year: 2021,
    accountId: [],
    lendAccount: []
  };
  lendTransactions : Transaction[] = [];
  sideAccountDTO: SideAccountDTO[] = [];

  ngOnInit(): void {
    this.portfolio.month = (new Date().getMonth() + 1);
    this.portfolio.year = (new Date().getFullYear());
    this.getPortfolio();
    
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

  getPortfolio(){
    this._service.getPorfolio(this.portfolio.month,this.portfolio.year).subscribe(response =>{
      console.log("!!! portfolio",response);
      //if we get portfolio
      if(response.portfolio.length > 0){
        this.portfolio = response.portfolio[0];
        console.log("!!!portfolio",this.portfolio);
        //Creating the side accounts from fetched portfolio
        this.getSideAccounts(this.portfolio.lendAccount);
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
