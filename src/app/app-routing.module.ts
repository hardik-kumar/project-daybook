import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';

const routes: Routes = [
  {path: 'bar-chart', component: DonutChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
