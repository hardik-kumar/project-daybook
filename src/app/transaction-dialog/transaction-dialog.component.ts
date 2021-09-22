import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatChipInputEvent} from '@angular/material/chips';
import { CommonService } from '../services/common.service';


@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.component.html',
  styleUrls: ['./transaction-dialog.component.scss']
})

export class TransactionDialogComponent implements OnInit {
  tags : string[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  categoryIcons : {[category: string]: string} = {}
  accountId: number = 0;
  types: string[] = ["income","spend"]
  categories:  string[] = []

          transactionForm: FormGroup ;
  constructor(public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public datePipe: DatePipe, 
    public commonService : CommonService) { }

  ngOnInit(): void {
    //console.log("data from account",this.data);
    this.accountId = this.data.accountId;
    this.categoryIcons = this.commonService.categoryIcons;
    this.categories = Object.keys(this.categoryIcons);

    this.transactionForm = new FormGroup({
      type: new FormControl("null", {validators: [Validators.required]}),
      description: new FormControl(""),
      amount: new FormControl(null,{validators: [Validators.required]}),
      date: new FormControl(null,{validators: [Validators.required]}),
      category: new FormControl(null,{validators: [Validators.required]}),
      tags: new FormControl([]),
      amountExclusion : new FormControl(false, {validators: [Validators.required]}),
      accountId: new FormControl()
    })

    if(this.data != undefined && this.data.edit){
      let transactionObj = this.data.transaction;
      //
      transactionObj.tags.forEach((element: string) => {
        this.tags.push(element)
      });
      this.transactionForm.patchValue({
        type: transactionObj.type,
      description: transactionObj.desc,
      amount: transactionObj.amount,
      // date: this.datePipe.transform(new Date(transactionObj.date), 'yyyy-dd-MM'),
      date: new Date(transactionObj.date),
      category: transactionObj.category,
      // tags: transactionObj.tags,
      amountExclusion : transactionObj.amountExclusion,
      accountId: transactionObj.accountId
      })
    }
  }
  onNoClick(): void {
    this.dialogRef.close({data: this.transactionForm});
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  saveTransaction(){
    console.log(this.transactionForm.controls['description'].value);
    let obj = {}
    // console.log(this.transactionForm.valid);
    // console.log(this.transactionForm.controls['type'].valid);
    // console.log(this.transactionForm.controls['description'].valid);
    // console.log(this.transactionForm.controls['amount'].valid);
    // console.log(this.transactionForm.controls['date'].valid);
    // console.log(this.transactionForm.controls['category'].valid);
    // console.log(this.transactionForm.controls['tags'].valid);
    // console.log(this.transactionForm.controls['amountExclusion'].valid);
    
    this.transactionForm.controls['tags'].setValue(this.tags);
    if(this.transactionForm.valid){
      obj = {
        id: 4,
        type: this.transactionForm.controls['type'].value,
        desc: this.transactionForm.controls['description'].value,
        amount: this.commonService.convertAmount(this.transactionForm.controls['amount'].value, this.transactionForm.controls['type'].value),
        date: this.datePipe.transform(this.transactionForm.controls['date'].value, 'dd-MM-yyyy'),
        category: this.transactionForm.controls['category'].value,
        tags: this.transactionForm.controls['tags'].value,
        amountExclusion: this.transactionForm.controls['amountExclusion'].value,
        accountId: this.accountId
      }
    }
    console.log("objjjj ",obj);
    
    this.dialogRef.close({data: obj});
  }

  typeChange(){
    console.log("type changed");
    
  }
}
