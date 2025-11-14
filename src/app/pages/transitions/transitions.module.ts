import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransitionsRoutingModule } from './transitions-routing.module';
import { TransitionsComponent } from './transitions/transitions.component';


@NgModule({
  declarations: [
    TransitionsComponent
  ],
  imports: [
    CommonModule,
    TransitionsRoutingModule
  ]
})
export class TransitionsModule { }
