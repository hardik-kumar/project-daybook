import { Component, Input, OnInit } from '@angular/core';
import {ChartType,ChartOptions} from 'chart.js'
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {
  @Input() pieChartLabels : string[] = [];
   @Input() pieChartData : number[] = [];
  public pieChartType : ChartType = 'pie';
  // colors: Color[] = [{backgroundColor :['#5fa8d3', '#c77dff', '#FA9F42', '#56cfe1', '#ef233c','#ffd166','#c7f9cc','#f4978e']}];
  colors: Color[] = [{backgroundColor :['#003f5c', '#2f4b7c', '#665191', '#a05195', '#d45087','#f95d6a','#ff7c43','#ffa600','#f29e4c']}];
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  constructor() { }
  ngOnInit() {
  }
}
