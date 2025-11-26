import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BaseAnimatedComponent } from 'src/app/components/base-animated.component';
import { GsapAnimationService } from 'src/app/services/gsap-animations.service';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.scss']
})
export class TimeLineComponent extends BaseAnimatedComponent implements OnInit, AfterViewInit {
  
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

  constructor(override gsapService: GsapAnimationService) {
    super(gsapService);
  }

  ngOnInit(): void {
    // Inicialização se necessário
  }

  ngAfterViewInit(): void {
    this.initializeAnimations();
  }

  initializeAnimations(): void {
    // Animação inicial do título
    this.gsapService.from('.timeline-header', {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'power3.out'
    });

    // Animação da linha central
    this.gsapService.from('.timeline-line', {
      duration: 1.5,
      scaleY: 0,
      transformOrigin: 'top',
      ease: 'power2.inOut',
      delay: 0.3
    });

    // Animação dos itens da timeline com ScrollTrigger
    this.timelineItems.forEach((item, index) => {
      const isLeft = index % 2 === 0;
      
      // Animação do card
      this.gsapService.from(`.timeline-item-${index}`, {
        scrollTrigger: {
          trigger: `.timeline-item-${index}`,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        x: isLeft ? -100 : 100,
        opacity: 0,
        ease: 'power3.out'
      });

      // Animação do ponto
      this.gsapService.from(`.timeline-dot-${index}`, {
        scrollTrigger: {
          trigger: `.timeline-item-${index}`,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        scale: 0,
        ease: 'back.out(1.7)',
        delay: 0.3
      });

      // Animação de hover no card
      const card = document.querySelector(`.timeline-item-${index} .timeline-card`);
      if (card) {
        card.addEventListener('mouseenter', () => {
          this.gsapService.to(card, {
            duration: 0.3,
            y: -10,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            ease: 'power2.out'
          });
        });

        card.addEventListener('mouseleave', () => {
          this.gsapService.to(card, {
            duration: 0.3,
            y: 0,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            ease: 'power2.out'
          });
        });
      }
    });

    // Animação de pulso contínuo nos dots
    this.gsapService.to('.timeline-dot', {
      duration: 2,
      scale: 1.1,
      opacity: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      stagger: 0.2
    });
  }
}