import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransitionsComponent } from './transitions/transitions.component';

const routes: Routes = [
  {
    path: '',
    component: TransitionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransitionsRoutingModule { }
