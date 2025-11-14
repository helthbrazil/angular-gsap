import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  private scrollTriggerInstance: ScrollTrigger | null = null;
  sizeOfGallery = 150;
  galleryItems = Array.from({ length: this.sizeOfGallery }, (_, i) => i + 1);

  private scrollTriggers: ScrollTrigger[] = [];

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }

  private animateFadeIn(): void {
    const items = this.el.nativeElement.querySelectorAll('.gallery-item');
    if (!items.length) return;

    gsap.set(items, { opacity: 0, y: 40 });

    const anim = gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: '.gallery',
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
        immediateRender: false
      }
    });

    if (anim.scrollTrigger) this.scrollTriggers.push(anim.scrollTrigger);
  }

  ngAfterViewInit(): void {
    this.animateFadeIn();

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 50);
  }


  ngOnDestroy(): void {
    // Matar todas as instâncias de ScrollTrigger
    this.scrollTriggers.forEach(trigger => {
      if (trigger) {
        trigger.kill(true);
      }
    });
    this.scrollTriggers = []; // Limpar o array

    // Matar todas as animações dos itens da galeria
    const items = this.el.nativeElement.querySelectorAll('.gallery-item');
    if (items.length) {
      gsap.killTweensOf(items);
      // Resetar propriedades dos itens
      gsap.set(items, {
        clearProps: 'all',
        opacity: 1,
        y: 0
      });
    }

    // Forçar atualização do ScrollTrigger
    ScrollTrigger.refresh(true);
  }
}
