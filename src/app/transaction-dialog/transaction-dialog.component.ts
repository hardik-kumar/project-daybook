import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatChipInputEvent} from '@angular/material/chips';


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


  types = [{typeId : 1, value: "income"},
          {typeId : 2, value: "spend"}]
  categories = [{categoryId: 1, value: "Bills"},
                {categoryId: 2, value: "EMI"},
                {categoryId: 3, value: "Entertainment"},
                {categoryId: 4, value: "Food & Drinks"},
                {categoryId: 5, value: "Fuel"},
                {categoryId: 6, value: "Groceries"},
                {categoryId: 7, value: "Health"},
                {categoryId: 8, value: "Investment"},
                {categoryId: 9, value: "Lend"},
                {categoryId: 10, value: "Shopping"},
                {categoryId: 11, value: "Transfer"},
                {categoryId: 12, value: "Travels"},
                {categoryId: 13, value: "Others"}]

          transactionForm: FormGroup ;
  constructor(public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public datepipe: DatePipe) { }

  ngOnInit(): void {

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
        amount: this.transactionForm.controls['amount'].value,
        date: this.datepipe.transform(this.transactionForm.controls['date'].value, 'dd-MM-yyyy'),
        category: this.transactionForm.controls['category'].value,
        tags: this.transactionForm.controls['tags'].value,
        amountExclusion: this.transactionForm.controls['amountExclusion'].value,
        accountId: 1
      }
    }
    console.log("objjjj ",obj);
    
    this.dialogRef.close({data: obj});
  }
}
