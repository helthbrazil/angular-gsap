import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  sizeOfGallery = 150;
  galleryItems = Array.from({ length: this.sizeOfGallery }, (_, i) => i + 1);

  private scrollTriggers: ScrollTrigger[] = [];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    this.animateFadeIn();
  }

  private animateFadeIn(): void {
    const items = this.el.nativeElement.querySelectorAll('.gallery-item');

    if (!items.length) return;

    const anim = gsap.fromTo(items,
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.gallery',
          start: 'top 85%',
          end: 'bottom top',
          toggleActions: 'play none none none', // 🔥 Executa só uma vez!
        }
      }
    );

    if (anim.scrollTrigger) {
      this.scrollTriggers.push(anim.scrollTrigger as ScrollTrigger);
    }
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(t => t.kill());
  }
}
