import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BaseAnimatedComponent } from 'src/app/components/base-animated.component';
import { GsapAnimationService } from 'src/app/services/gsap-animations.service';

export interface Image {
  url: string | undefined;
}
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent extends BaseAnimatedComponent implements OnInit, AfterViewInit, OnDestroy {
  private scrollTriggerInstance: ScrollTrigger | null = null;
  sizeOfGallery = 150;
  galleryItems = Array.from({ length: this.sizeOfGallery }, (_, i) => i + 1);
  imagePreview: Image = {
    url: ''
  };

  private scrollTriggers: ScrollTrigger[] = [];
  private hoverHandlers = new Map<HTMLElement, { handleMouseEnter: () => void; handleMouseLeave: () => void }>();

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
    this.animateFadeIn();
  }

  private animateFadeIn(): void {
    const items = this.el.nativeElement.querySelectorAll('.gallery-item');
    if (!items.length) return;

    // Configuração inicial dos itens
    gsap.set(items, { 
      opacity: 0, 
      y: 10,
      scale: 0.97,
      transformOrigin: 'center center',
      willChange: 'transform, opacity'
    });

    // Converter NodeList para array de HTMLElement
    const itemsArray: HTMLElement[] = Array.from(items) as HTMLElement[];
    
    // Animação para cada item individualmente
    itemsArray.forEach((item, index) => {
      // Calcula a posição na grade (assumindo 5 colunas)
      const row = Math.floor(index / 5);
      const col = index % 5;
      
      // Atraso baseado na posição para criar efeito de onda
      const delay = (row * 0.04) + (col * 0.02);
      
      // Configuração da animação de entrada
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          end: 'bottom 5%',
          scrub: 0.5, // Suaviza a animação durante o scroll
          markers: false, // Ativar apenas para debug
          toggleActions: 'play none none none',
          once: true,
          onEnter: () => {
            // Animação principal de entrada
            gsap.to(item, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power2.out',
              delay: delay,
              onComplete: () => {
                // Efeito sutil de respiro após a animação
                gsap.to(item, {
                  scale: 1.02,
                  duration: 3,
                  yoyo: true,
                  repeat: -1,
                  ease: 'sine.inOut',
                  overwrite: 'auto'
                });
              }
            });

            // Efeito de brilho sutil
            gsap.to(item, {
              '--glow-opacity': 0.3,
              duration: 1.5,
              delay: delay + 0.2,
              ease: 'power2.out'
            });
          }
        }
      });

      // Efeito hover aprimorado
      const handleMouseEnter = () => {
        gsap.killTweensOf(item);
        
        gsap.to(item, {
          scale: 1.05,
          y: -5,
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => {
            // Efeito de pulso sutil
            gsap.to(item, {
              scale: 1.06,
              duration: 1.2,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut'
            });
          }
        });

        // Efeito de brilho mais intenso no hover
        gsap.to(item, {
          '--glow-opacity': 0.6,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.killTweensOf(item);
        
        gsap.to(item, {
          scale: 1,
          y: 0,
          boxShadow: '0 4px 12px var(--gallery-shadow)',
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });

        // Reset do brilho
        gsap.to(item, {
          '--glow-opacity': 0.15,
          duration: 0.5,
          ease: 'power2.out'
        });
      };

      // Adiciona os listeners de hover
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);
      
      // Armazena os listeners para limpeza posterior
      this.hoverHandlers.set(item, { handleMouseEnter, handleMouseLeave });

      if (tl.scrollTrigger) {
        this.scrollTriggers.push(tl.scrollTrigger);
      }
    });
  }

  previewImage(url: string){
    this.imagePreview.url = url;
  }

  ngAfterViewInit(): void {
    // Aguarda um frame para garantir que o DOM esteja pronto
    requestAnimationFrame(() => {
      this.animateFadeIn();
      
      // Força uma atualização do ScrollTrigger após um pequeno atraso
      // para garantir que todos os elementos estejam renderizados
      setTimeout(() => {
        ScrollTrigger.refresh(true);
        
        // Força outra atualização após as animações iniciais
        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true);
        });
      }, 100);
    });
  }


  override ngOnDestroy(): void {
    super.ngOnDestroy();
    
    // Remover todos os listeners de hover
    this.hoverHandlers.forEach((handlers, element) => {
      element.removeEventListener('mouseenter', handlers.handleMouseEnter);
      element.removeEventListener('mouseleave', handlers.handleMouseLeave);
    });
    this.hoverHandlers.clear();
    
    // Matar todas as instâncias de ScrollTrigger
    this.scrollTriggers.forEach(trigger => {
      if (trigger) {
        trigger.kill(true);
      }
    });
    this.scrollTriggers = [];

    // Matar todas as animações dos itens da galeria
    const items = this.el.nativeElement.querySelectorAll('.gallery-item');
    if (items.length) {
      gsap.killTweensOf(items);
      // Resetar propriedades dos itens
      gsap.set(items, {
        clearProps: 'all',
        opacity: 1,
        y: 0,
        scale: 1,
        '--glow-opacity': 0
      });
    }

    // Forçar atualização do ScrollTrigger
    ScrollTrigger.refresh(true);
  }
}
