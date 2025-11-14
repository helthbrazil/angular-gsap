import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParallaxRoutingModule } from './parallax-routing.module';
import { ParallaxComponent } from './parallax/parallax.component';


@NgModule({
  declarations: [
    ParallaxComponent
  ],
  imports: [
    CommonModule,
    ParallaxRoutingModule
  ]
})
export class ParallaxModule { }
