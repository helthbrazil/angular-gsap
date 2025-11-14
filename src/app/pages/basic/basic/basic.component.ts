import { AfterViewInit, Component, ElementRef, ViewChildren, QueryList, OnDestroy, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('animatedElements') animatedElements!: QueryList<ElementRef>;
  private scrollTriggers: ScrollTrigger[] = [];

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initAnimations();

      const video = document.querySelector('.hero-background') as HTMLVideoElement;
      if (video) {
        video.muted = true;
        video.play().catch(err => console.warn('Vídeo não pode autoplay:', err));
      }
    }, 100);
  }

  private initAnimations(): void {
    this.animatedElements.forEach(elRef => {
      const el = elRef.nativeElement;
      const text = el.querySelector('.text-left');
      const image = el.querySelector('.image-right');

      if (!text || !image) return;

      // Reset inicial: texto à esquerda, imagem à direita, opacidade 0
      gsap.set(text, { x: -200, opacity: 0 });
      gsap.set(image, { x: 200, opacity: 0 });

      // Timeline com ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'bottom 20%', // animação completa antes de sair
          scrub: true,
          markers: false,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;

            // Entrada
            if (progress < 0.5) {
              gsap.to(text, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
              gsap.to(image, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
            }

            // Saída lateral somente quando estiver na parte inferior
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
              // Ainda na parte visível, não sair
              return;
            }

            // Sair lateralmente se estiver fora da parte visível
            if (rect.top >= windowHeight * 0.7) {
              gsap.to(text, { x: -200, opacity: 0, duration: 0.5, ease: 'power2.in' });
              gsap.to(image, { x: 200, opacity: 0, duration: 0.5, ease: 'power2.in' });
            }
          }
        }
      });

      this.scrollTriggers.push(tl.scrollTrigger as ScrollTrigger);
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach(st => st.kill(true));
    this.scrollTriggers = [];

    this.animatedElements.forEach(elRef => {
      const el = elRef.nativeElement;
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'all', opacity: 1, x: 0 });
    });

    ScrollTrigger.getAll().forEach(st => st.kill(true));
    ScrollTrigger.refresh();
  }
}
