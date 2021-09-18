import { Component, Input, OnInit } from '@angular/core';
// import { TransactionService } from '../services/transaction.service';
import { TransactionService } from 'src/app/transaction.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog.component';
import { Transaction } from 'src/assets/model/transaction';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { CommonService } from '../services/common.service';
import { element } from 'protractor';
// import * as df from 'dateformat';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private service : TransactionService, 
              public dialog: MatDialog,
              public datepipe: DatePipe,
              public commonService : CommonService) { }
  transactions:Transaction[] = [];
  bulkTransaction: Transaction[] = [];
  errorLog: Transaction[] = [];
  balance: number = 0;
  isErrorLog: boolean = false;
  pieChartDataIn : number[]= [];
  pieChartLabelsIn : string[] = []
  pieChartDataEx : number[]= [];
  pieChartLabelsEx : string[] = [];
  showChart : boolean = true;
  rowIndex: number = -1;
  @Input() accountId: number;

  categoryIcons : {[category: string]: string} = {}
    
  ngOnInit(): void {
    this.categoryIcons = this.commonService.categoryIcons;
    this.getTransactions();
    // this.service.getTransaction().subscribe(response => {
    //   this.transactions = response;
    //   this.calculateBalance();
    // })

    console.log("!!!",this.commonService.categoryIcons['Food & Drinks']);
    console.log("!!!",this.commonService.categoryIcons['Bills']);
    
  }

  getTransactions(){
    this.service.allTransactions(this.accountId).subscribe(response => {
      console.log("from backend",response);
      this.transactions = response.allTransactions;
      this.calculateBalance();
      this.prepareCharts();
    })
  }
  prepareCharts(){
    //seperating income/expense transactions
    let inTransactions: Transaction[] = [];
    let exTransactions: Transaction[] = [];
    this.transactions.forEach(transactionObj =>{
      if(transactionObj.amount > 0) inTransactions.push(transactionObj)
      else exTransactions.push(transactionObj);
    })
    
    console.log(inTransactions);
    console.log(exTransactions);
        
    console.log(this.commonService.categorizeTransactions(inTransactions));
    let chartObj = this.commonService.categorizeTransactions(inTransactions);
    this.pieChartLabelsIn = chartObj.labels;
    this.pieChartDataIn = chartObj.values;

    chartObj = this.commonService.categorizeTransactions(exTransactions)
    this.pieChartLabelsEx = chartObj.labels;
    this.pieChartDataEx = chartObj.values;
  }

  deleteSingleTransaction(id: string){
    this.service.deleteTransaction(id).subscribe(response => {
      console.log("delete response",response);
      this.getTransactions();      
    })
  }
  calculateBalance(){
    this.balance = this.transactions.map(value => value.amount).reduce((accumulator, currentValue) => accumulator + currentValue);

  }
  openDialog(): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '550px',
      data: {accountId: this.accountId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        console.log("save object->",result);
        this.service.addTransaction(result.data).subscribe(response => {
          console.log("RESPONSE",response);
          
        })        
        console.log(this.transactions);
        this.getTransactions();
      }
      
    });
  }

  editDialog(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '550px',
      data: {edit:true, transaction: transaction,accountId: this.accountId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result){
        console.log("edit object->",result);
        this.service.updateTransaction(String(transaction._id),result.data).subscribe(response => {
          console.log("RESPONSE",response);
        })
        console.log(this.transactions);
        this.getTransactions();
      }
      
    });
  }

  addBulkTransaction(){
    // let bulkTransactions = [result.data,result.data,result.data]
    // let bulkTransactions : any[]= []
        console.log("saving bulk transaction",this.bulkTransaction);
        this.service.addBulkTransaction(this.bulkTransaction).subscribe(response => {
          console.log(response);
          this.getTransactions();
        })
  }



  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      let tempBulkObj = <Transaction[]>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      console.log("data:",tempBulkObj);
      let isAdded = false;
      for (let index = 0; index < tempBulkObj.length; index++) {
        if(index == 0) continue;
          isAdded = this.recordToObject(tempBulkObj[index], index);
          console.log("is added check",isAdded," ", index);
          if(!isAdded) {
            break;
          }
      }

      if(isAdded){
        this.addBulkTransaction();
      }
      console.log("after for loop bulk obj", this.bulkTransaction);
      
    };
    reader.readAsBinaryString(target.files[0]);
  }

  // parseDate(dateN: any): String{
  //   const parsedDate: Date = new Date(dateN);
  //   parsedDate.setHours(parsedDate.getHours() + timezoneOffset); // utc-dates
  //   dateN = df(parsedDate, "dd/mm/yyyy");
  //   return dateN;
  // }

  validateTransactionObj(tempObj: Transaction): boolean{
    console.log(typeof tempObj.amount == "number");
    
    if(
      (tempObj.type != null && tempObj.type != undefined && tempObj.type.trim() != '') &&
      (tempObj.desc != null && tempObj.desc != undefined && tempObj.desc.trim() != '' ) && 
      (tempObj.amount != null && tempObj.amount != undefined && typeof tempObj.amount =="number") &&
      (tempObj.date != null && tempObj.date != undefined && tempObj.date.trim() != '' ) && 
      (tempObj.category != null && tempObj.category != undefined && tempObj.category.trim() != '' ) && 

      (tempObj.amountExclusion != null && tempObj.amountExclusion != undefined && (tempObj.amountExclusion == true || tempObj.amountExclusion == false) ) && 
      (tempObj.accountId != null && tempObj.accountId != undefined && typeof tempObj.accountId =="number")      
    ){
      return true;
    }
    return false;
  }

  recordToObject(record: any, index: Number): boolean{
    // console.log("incoming record",record,"index ",index);
    let tempObj : Transaction = {
      type: record[0],
      desc: record[1],
      amount: this.commonService.convertAmount(record[2],record[0]),
      date: record[3],
      category: record[4],
      tags: record[5].split(','),
      amountExclusion : record[6],
      accountId: this.accountId
    }
    let isValid = this.validateTransactionObj(tempObj);    
    if(isValid){
      this.bulkTransaction.push(tempObj);
    }
    else{
      this.errorLog.push(tempObj);
      console.log("error log",this.errorLog);
      this.isErrorLog = true;
    }
    console.log("temp obj",tempObj);
     return isValid
  }

  displayedColumns: string[] = ['type','desc','amount','date','category','tags','amountExclusion','accountId'];
  dataSource = this.errorLog;
}