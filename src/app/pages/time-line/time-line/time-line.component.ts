import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { BaseAnimatedComponent } from 'src/app/components/base-animated.component';
import { GsapAnimationService } from 'src/app/services/gsap-animations.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent extends BaseAnimatedComponent implements OnInit, AfterViewInit, OnDestroy {
  private resizeObserver: ResizeObserver | null = null;
  private scrollTriggers: ScrollTrigger[] = [];
  private hoverAnimations: gsap.core.Tween[] = [];
  private pulseAnimation: gsap.core.Tween | null = null;
  private headerAnimation: gsap.core.Tween | null = null;
  private lineAnimation: gsap.core.Tween | null = null;

  timelineItems = [
    {
      year: '2020',
      title: 'Fundação da Empresa',
      description: 'Início da jornada com uma visão inovadora de transformar o mercado digital.',
      icon: '🚀'
    },
    {
      year: '2021',
      title: 'Primeiro Produto Lançado',
      description: 'Lançamento da plataforma que revolucionou a experiência do usuário.',
      icon: '💡'
    },
    {
      year: '2022',
      title: 'Expansão Internacional',
      description: 'Abertura de escritórios em 5 países e crescimento de 300% na base de clientes.',
      icon: '🌍'
    },
    {
      year: '2023',
      title: 'Prêmios e Reconhecimento',
      description: 'Conquistamos os principais prêmios de inovação e tecnologia do setor.',
      icon: '🏆'
    },
    {
      year: '2024',
      title: 'Novo Marco de Crescimento',
      description: 'Alcançamos 1 milhão de usuários ativos e lançamos IA avançada.',
      icon: '⭐'
    }
  ];

  constructor(
    override gsapService: GsapAnimationService,
    private elementRef: ElementRef
  ) {
    super(gsapService);
  }

  ngOnInit(): void {
    // Garante que o ScrollTrigger esteja registrado
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  ngAfterViewInit(): void {
    // Espera um frame para garantir que o DOM esteja pronto
    requestAnimationFrame(() => {
      this.initializeAnimations();
      this.setupResizeObserver();
      // Força uma atualização do ScrollTrigger após a renderização
      setTimeout(() => ScrollTrigger.refresh(true), 100);
    });
  }

  private setupResizeObserver(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      const container = this.elementRef.nativeElement.querySelector('.timeline-container');
      if (container) {
        this.resizeObserver.observe(container);
      }
    }
  }

  private clearAnimations(): void {
    // Limpa todos os ScrollTriggers
    this.scrollTriggers.forEach(trigger => trigger.kill());
    this.scrollTriggers = [];

    // Limpa animações de hover
    this.hoverAnimations.forEach(anim => anim.kill());
    this.hoverAnimations = [];

    // Limpa animações específicas
    if (this.pulseAnimation) this.pulseAnimation.kill();
    if (this.headerAnimation) this.headerAnimation.kill();
    if (this.lineAnimation) this.lineAnimation.kill();
  }

  initializeAnimations(): void {
    // Limpa animações existentes
    this.clearAnimations();

    // Animação do cabeçalho
    this.headerAnimation = gsap.from('.timeline-header', {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'power3.out',
      onComplete: () => {
        // Força uma atualização do ScrollTrigger após a animação do cabeçalho
        ScrollTrigger.refresh();
      }
    });

    // Animação da linha central
    this.lineAnimation = gsap.from('.timeline-line', {
      duration: 1.5,
      scaleY: 0,
      transformOrigin: 'top',
      ease: 'power2.inOut',
      delay: 0.3
    });

    // Configura os itens da timeline
    this.setupTimelineItems();

    // Animação de pulso contínuo nos dots
    this.pulseAnimation = gsap.to('.timeline-dot', {
      duration: 2,
      scale: 1.1,
      opacity: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.2
    });
  }

  private setupTimelineItems(): void {
    this.timelineItems.forEach((item, index) => {
      const isLeft = index % 2 === 0;
      const itemSelector = `.timeline-item-${index}`;
      const dotSelector = `.timeline-dot-${index}`;
      const cardSelector = `${itemSelector} .timeline-card`;

      // Configura a animação inicial do item
      gsap.set([itemSelector, dotSelector], { opacity: 0 });
      gsap.set(itemSelector, { x: isLeft ? -50 : 50 });

      // Cria o ScrollTrigger para o item
      const itemTrigger = ScrollTrigger.create({
        trigger: itemSelector,
        start: 'top 80%',
        onEnter: () => this.animateTimelineItem(itemSelector, dotSelector, isLeft),
        onEnterBack: () => this.animateTimelineItem(itemSelector, dotSelector, isLeft)
      });

      this.scrollTriggers.push(itemTrigger);

      // Configura o efeito hover no card
      const card = this.elementRef.nativeElement.querySelector(cardSelector);
      if (card) {
        const hoverTween = gsap.to(card, {
          duration: 0.3,
          y: -10,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          ease: 'power2.out',
          paused: true
        });

        card.addEventListener('mouseenter', () => hoverTween.play());
        card.addEventListener('mouseleave', () => hoverTween.reverse());
        this.hoverAnimations.push(hoverTween);
      }
    });
  }

  private animateTimelineItem(itemSelector: string, dotSelector: string, isLeft: boolean): void {
    // Animação do card
    gsap.to(itemSelector, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Animação do ponto
    gsap.to(dotSelector, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: 0.3
    });
  }

  override ngOnDestroy(): void {
    // Limpa o ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Limpa todas as animações
    this.clearAnimations();

    // Força uma atualização final
    ScrollTrigger.refresh(true);
    
    super.ngOnDestroy();
  }
}