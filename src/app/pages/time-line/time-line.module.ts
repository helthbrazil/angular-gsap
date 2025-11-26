import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeLineRoutingModule } from './time-line-routing.module';
import { TimeLineComponent } from './time-line/time-line.component';


@NgModule({
  declarations: [
    TimeLineComponent
  ],
  imports: [
    CommonModule,
    TimeLineRoutingModule
  ]
})
export class TimeLineModule { }
