import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { TransactionService } from 'src/app/transaction.service';
import { SideAccountDTO, SideAccount } from 'src/assets/model/sideAccount';

@Component({
  selector: 'app-side-account',
  templateUrl: './side-account.component.html',
  styleUrls: ['./side-account.component.scss']
})
export class SideAccountComponent implements OnInit, OnChanges {

  @Input() sideAccountDTO: SideAccountDTO;
  @Output() newSideAccountId = new EventEmitter<string>();

  categoryIcons : {[category: string]: string} = {}
  previousBalance: number = 0;
  finalBalance: number = 0;
  transactionIds: string[] = []

  disableSave: boolean = false;
  constructor(private _service : TransactionService, private commonService: CommonService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("!! side acc created",this.sideAccountDTO._id);
    // console.log("ID---",this.sideAccountDTO._id);

    //For existing side account
    if(this.sideAccountDTO._id && this.sideAccountDTO._id != ''){
      this.disableSave = true;
    }
    else {
      //For new side account
      //We will get the previous side account id and initialize in sideAccountDTO object
      //this will initialize previous side account id & previous balance variables
      this.getPreviousAccount();
      //seperating transactions for saving object
      this.getTransactionIds();
      //console.log("!! DTO obj",this.sideAccountDTO);
    }
    
  }
  ngOnInit(): void {
    this.categoryIcons = this.commonService.categoryIcons;

  }
  getSideAccount(id: string){
    // let sideAccId = '614b3b18eed15303801ffbb1';
    this._service.getSideAccount(id).subscribe(response => {
      //console.log("get side account ", response);
    })
  }

  calculateFinalBalance():number{
    this.finalBalance = this.sideAccountDTO.transactions
    .map(value => value.amount)
    .reduce((accumulator, currentValue) => {return accumulator + currentValue},0) + this.previousBalance;

    return this.finalBalance;
  }
  getPreviousBalance(): number{
    return 0;
  }
  getTransactionIds(){ 
    this.sideAccountDTO.transactions.forEach(transaction =>{
      if(transaction._id) this.transactionIds.push(transaction._id);
    })
  }
  getPreviousAccount(){
    // console.log("!!",this.sideAccountDTO.previousId);

    let date = new Date()
    date.setMonth(Number(this.sideAccountDTO.month)-1);
    date.setFullYear(Number(this.sideAccountDTO.year))
    date.setMonth(date.getMonth() - 1);
    //
    // this._service.getPreviousSideAccount(this.sideAccountDTO.accountName,(date.getMonth() + 1).toString(),(date.getFullYear()).toString()).subscribe(response => {
      this._service.getPreviousSideAccount(this.sideAccountDTO.accountName,(date.getMonth() + 1),(date.getFullYear())).subscribe(response => {
      // console.log("!! resp",response);
      if(response.message == 'Success!'){
        let previousSideAccount = response.sideAccount[0];
        if(previousSideAccount){
          this.sideAccountDTO.previousId = previousSideAccount._id;
          this.previousBalance = previousSideAccount.finalBalance;
          // console.log("!!ab",this.sideAccountDTO.previousId);
        }else{
          this.previousBalance = 0;
        }
    //Once previous balance is updated then final balance will be calculated
    this.calculateFinalBalance();
      }
    })
  }
  saveSideAccount(){
    let obj: SideAccount = {
      accountName: this.sideAccountDTO.accountName,
    previousBalance: this.previousBalance,
    finalBalance: this.finalBalance,
    transactions : this.transactionIds,
    previousId: this.sideAccountDTO.previousId,
    month: this.sideAccountDTO.month,
    year: this.sideAccountDTO.year
    }
    this._service.addSideAccount(obj).subscribe(response => {
      console.log("side account response ",response);
      if(response && response.id){
        this.newSideAccountId.emit(response.id);
      }
      this.disableSave = true;
    })
  }

  saveDmySideAccount(){
    let obj: SideAccount = {
      accountName: 'Name3',
    previousBalance: 50,
    finalBalance: 500,
    transactions : [],
    previousId: '',
    month: 8,
    year: 2021
    }
    // this._service.addSideAccount(obj).subscribe(response => {
    //   console.log("side account response ",response);
      
    // })
  }
}