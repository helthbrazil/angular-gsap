import { Component, OnInit, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-transitions',
  templateUrl: './transitions.component.html',
  styleUrls: ['./transitions.component.scss']
})
export class TransitionsComponent implements OnInit, AfterViewInit {

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const card = this.el.nativeElement.querySelector('.card-3d');

    // Reset inicial
    gsap.set(card, { rotateX: 0, rotateY: 0, rotateZ: 0 });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const card = this.el.nativeElement.querySelector('.card-3d');
    if (!card) return;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = ((x - midX) / midX) * 15; // Inclinação lateral
    const rotateX = -((y - midY) / midY) * 15; // Inclinação vertical

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power3.out"
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    const card = this.el.nativeElement.querySelector('.card-3d');

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out"
    });
  }
}
