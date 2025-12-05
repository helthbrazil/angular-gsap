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
  },
  {
    path: 'timeline',
    loadChildren: () => import('./pages/time-line/time-line.module').then(m => m.TimeLineModule)
  },
  {
    path: 'draggable',
    loadChildren: () => import('./pages/draggable/draggable.module').then(m => m.DraggableModule)
  },
  {
    path: 'motion-path',
    loadChildren: () => import('./pages/motion-path/motion-path.module').then(m => m.MotionPathModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule)
  },
  {
    path: 'effects',
    loadChildren: () => import('./pages/effects/effects.module').then(m => m.EffectsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
