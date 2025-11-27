import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DraggableComponent } from './draggable.component';

const routes: Routes = [
    {
        path: '',
        component: DraggableComponent
    }
];

@NgModule({
    declarations: [
        DraggableComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class DraggableModule { }
