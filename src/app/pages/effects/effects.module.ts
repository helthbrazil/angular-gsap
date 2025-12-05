import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EffectsComponent } from './effects.component';
import { ScrollExpandComponent } from './scroll-expand/scroll-expand.component';

const routes: Routes = [
    { path: '', component: EffectsComponent }
];

@NgModule({
    declarations: [
        EffectsComponent,
        ScrollExpandComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class EffectsModule { }
