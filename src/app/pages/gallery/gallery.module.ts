import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { ArcGalleryHeroComponent } from './arc-gallery-hero/arc-gallery-hero.component';
import { InteractiveSelectorComponent } from './interactive-selector/interactive-selector.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PreviewComponent } from 'src/app/components/preview/preview.component';


@NgModule({
  declarations: [
    GalleryComponent,
    ArcGalleryHeroComponent,
    InteractiveSelectorComponent
  ],
  imports: [
    CommonModule,
    GalleryRoutingModule,
    MatInputModule,
    PreviewComponent,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class GalleryModule { }
