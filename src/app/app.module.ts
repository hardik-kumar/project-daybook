import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountComponent } from './account/account.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material.module';
import { TransactionDialogComponent } from './transaction-dialog/transaction-dialog.component'
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { ChartsModule } from 'ng2-charts';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';
import { PieChartComponent } from './components/charts/pie-chart/pie-chart.component'; 
import { MatIconModule } from '@angular/material/icon';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SideAccountComponent } from './components/side-account/side-account.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    TransactionDialogComponent,
    DonutChartComponent,
    PieChartComponent,
    PortfolioComponent,
    SideAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularMaterialModule,
    MatFormFieldModule, 
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    ChartsModule,
    MatIconModule
    
  ],
  providers: [DatePipe,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent],
  entryComponents: [TransactionDialogComponent]
})
export class AppModule { }
