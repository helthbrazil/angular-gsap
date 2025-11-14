import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParallaxComponent } from './parallax/parallax.component';

const routes: Routes = [
  {
    path: '',
    component: ParallaxComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParallaxRoutingModule { }
