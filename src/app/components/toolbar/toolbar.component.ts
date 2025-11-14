import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() theme: 'light' | 'dark' = 'light';
  @Output() toggleTheme = new EventEmitter<void>();
  

  constructor() { }

  ngOnInit(): void {
  }

  toggleThemeEvent() {
    this.toggleTheme.emit();
  }



}
