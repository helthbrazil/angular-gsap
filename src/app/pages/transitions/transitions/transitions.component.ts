import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BaseAnimatedComponent } from 'src/app/components/base-animated.component';
import { GsapAnimationService } from 'src/app/services/gsap-animations.service';

@Component({
  selector: 'app-transitions',
  templateUrl: './transitions.component.html',
  styleUrls: ['./transitions.component.scss']
})
export class TransitionsComponent extends BaseAnimatedComponent implements OnInit, AfterViewInit, OnDestroy {

  private scrollTriggers: ScrollTrigger[] = [];

  mouseX = 0;
  mouseY = 0;

  constructor(
    private el: ElementRef,
    protected override gsapService: GsapAnimationService
  ) {
    super(gsapService);
  }

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }

  initializeAnimations(): void {
    this.init3DCard();
    this.initScrollAnimations();
    this.initMaskReveal();
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
    // Refresh do ScrollTrigger para corrigir posições
    setTimeout(() => ScrollTrigger.refresh(), 50);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    
    // Kill todos os ScrollTriggers
    this.scrollTriggers.forEach(st => st.kill(true));
    this.scrollTriggers = [];

    // Resetar todas as animações
    const cards = this.el.nativeElement.querySelectorAll('.card-3d, .section-3d, .mask-content');
    if (cards.length) {
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: 'all', opacity: 1, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0 });
    }

    ScrollTrigger.refresh(true);
  }

  /* ------------------ */
  /* 3D Card Interativo */
  /* ------------------ */
  private init3DCard(): void {
    const card = this.el.nativeElement.querySelector('.card-3d');
    if (card) {
      gsap.set(card, { rotateX: 0, rotateY: 0, rotateZ: 0 });
    }
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

    let rotateY = ((x - midX) / midX) * 15;
    let rotateX = -((y - midY) / midY) * 15;

    // Limitar os ângulos
    rotateY = Math.max(Math.min(rotateY, 15), -15);
    rotateX = Math.max(Math.min(rotateX, 15), -15);

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power3.out'
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    const card = this.el.nativeElement.querySelector('.card-3d');
    if (!card) return;

    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
  }

  private initScrollAnimations(): void {
    const sections3D = this.el.nativeElement.querySelectorAll('.section-3d');
    sections3D.forEach((sec: HTMLElement) => {
      // Animação de entrada
      const anim = gsap.from(sec, {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sec,
          start: 'top 80%',
          toggleActions: 'play none none none',
          immediateRender: true
        }
      });
      if (anim.scrollTrigger) this.scrollTriggers.push(anim.scrollTrigger);

      // Parallax de fundo
      gsap.to(sec, {
        backgroundPositionY: '20%',
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    });
  }


  /* ------------------ */
  /* Mask Sliding Reveal */
  /* ------------------ */
  private initMaskReveal(): void {
    const maskSections = this.el.nativeElement.querySelectorAll('.reveal-mask');
    maskSections.forEach((sec: HTMLElement) => {
      const maskContent = sec.querySelector('.mask-content');
      if (!maskContent) return;

      const anim = gsap.fromTo(maskContent,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
            toggleActions: 'play none none none',
            immediateRender: false
          }
        }
      );
      if (anim.scrollTrigger) this.scrollTriggers.push(anim.scrollTrigger);
    });
  }
}
