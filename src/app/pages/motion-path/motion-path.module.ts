import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MotionPathComponent } from './motion-path.component';

const routes: Routes = [
    {
        path: '',
        component: MotionPathComponent
    }
];

@NgModule({
    declarations: [
        MotionPathComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class MotionPathModule { }
