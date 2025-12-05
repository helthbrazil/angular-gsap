import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  span: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  modalImage: string | null = null;
  private scrollTriggerInstances: ScrollTrigger[] = [];

  galleryData: GalleryItem[] = [
    {
      id: 1,
      src: "https://i.pravatar.cc/800?img=1",
      alt: "Portrait 1",
      title: "Portrait 1",
      span: "col-span-1"
    },
    {
      id: 2,
      src: "https://i.pravatar.cc/800?img=2",
      alt: "Portrait 2",
      title: "Portrait 2",
      span: "sm:col-span-2"
    },
    {
      id: 3,
      src: "https://i.pravatar.cc/800?img=3",
      alt: "Portrait 3",
      title: "Portrait 3",
      span: "col-span-1"
    },
    {
      id: 4,
      src: "https://i.pravatar.cc/800?img=4",
      alt: "Portrait 4",
      title: "Portrait 4",
      span: "col-span-1"
    },
    {
      id: 5,
      src: "https://i.pravatar.cc/800?img=5",
      alt: "Portrait 5",
      title: "Portrait 5",
      span: "sm:col-span-2"
    },
    {
      id: 6,
      src: "https://i.pravatar.cc/800?img=6",
      alt: "Portrait 6",
      title: "Portrait 6",
      span: "col-span-1"
    },
    {
      id: 7,
      src: "https://i.pravatar.cc/800?img=7",
      alt: "Portrait 7",
      title: "Portrait 7",
      span: "col-span-1"
    },
    {
      id: 8,
      src: "https://i.pravatar.cc/800?img=8",
      alt: "Portrait 8",
      title: "Portrait 8",
      span: "col-span-1"
    },
    {
      id: 9,
      src: "https://i.pravatar.cc/800?img=9",
      alt: "Portrait 9",
      title: "Portrait 9",
      span: "sm:col-span-2"
    }
  ];

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    // Use setTimeout para garantir que o DOM está pronto
    setTimeout(() => {
      this.animateGalleryCards();
    }, 100);
  }

  private animateGalleryCards(): void {
    const cards = this.el.nativeElement.querySelectorAll('.gallery-card');

    if (cards.length) {
      // Primeiro, garantir que os cards estão visíveis
      gsap.set(cards, { opacity: 1, y: 0 });

      // Então animar
      const animation = gsap.from(cards, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 80%',
          onEnter: () => {
            // Força a animação quando entra na viewport
          }
        }
      });

      // Armazenar o ScrollTrigger para cleanup
      if (animation.scrollTrigger) {
        this.scrollTriggerInstances.push(animation.scrollTrigger);
      }

      // Refresh ScrollTrigger após pequeno delay
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }
  }

  openModal(src: string): void {
    this.modalImage = src;
  }

  closeModal(): void {
    this.modalImage = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }

  ngOnDestroy(): void {
    // Limpar todos os ScrollTriggers
    this.scrollTriggerInstances.forEach(trigger => {
      if (trigger) {
        trigger.kill();
      }
    });
    this.scrollTriggerInstances = [];

    // Resetar os cards ao estado original
    const cards = this.el.nativeElement.querySelectorAll('.gallery-card');
    if (cards.length) {
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: 'all' });
    }

    // Refresh geral
    ScrollTrigger.refresh();
  }
}
