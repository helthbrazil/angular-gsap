import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'basic',
    pathMatch: 'full'
  },
  {
    path: 'basic',
    loadChildren: () => import('./pages/basic/basic.module').then(m => m.BasicModule)
  },
  {
    path: 'parallax',
    loadChildren: () => import('./pages/parallax/parallax.module').then(m => m.ParallaxModule)
  },
  {
    path: 'transitions',
    loadChildren: () => import('./pages/transitions/transitions.module').then(m => m.TransitionsModule)
  },
  {
    path: 'gallery',
    loadChildren: () => import('./pages/gallery/gallery.module').then(m => m.GalleryModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
