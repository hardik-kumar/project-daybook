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
    lendAccounts: []
  };
  lendTransactions : Transaction[] = [];
  sideAccountDTO: SideAccountDTO[] = [];

  ngOnInit(): void {
    this.portfolio.month = (new Date().getMonth() + 1);
    this.portfolio.year = (new Date().getFullYear());
    this.getPortfolio();
    //console.log("MONTH ",new Date().getMonth() + 1);
    //console.log("MONTH ",new Date().getFullYear());
    
  }
  inLendTransactions(lendTransactionEvent: Transaction[]){
    lendTransactionEvent.forEach(element => {
      this.lendTransactions.push(element)
    });
    //console.log("incoming lend transactions ",this.lendTransactions);
    // this.getPortfolio();
    this.createSideAccounts(this.lendTransactions);
  }

  getPortfolio(){
    this._service.getPorfolio(this.portfolio.month,this.portfolio.year).subscribe(response =>{
      this.portfolio = response.portfolio[0];
      // console.log("RESPONSE !!!",this.portfolio);
      // console.log("RESPONSE !!!",response.portfolio[0]);
    })
  }

  savePortfolio(){
    this.portfolio.month = 4;
    this.portfolio.year = 2008;
    // let obj : Portfolio = {
    //   month: '09',
    //   year: '2021',
    //   accountId : [1,2,3],
    //   lendAccounts: ['abc']
    // }
    // this._service.addPortfolio(obj).subscribe(response => {
    //   console.log("RESPONSE !!!",response);
      
    // })
  }
  deletePortfolio(){
    let id: string = this.portfolio._id !;
    this._service.deletePortfolio(id).subscribe(response => {
      //console.log("RESPONSE !!!",response);
    })
  }
  createSideAccounts(lendTransactions: Transaction[]){
    console.log(lendTransactions);
    let map = this._commonService.categorizeLendTransactions(lendTransactions);
    console.log("map",map);
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
    console.log("obj",this.sideAccountDTO);
    
  }
}
