import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('section') section!: ElementRef;
  private scrollTriggerInstance: ScrollTrigger | null = null;

  ngOnInit(): void {
    // Registrar o plugin no início
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    // Pequeno delay para garantir que o DOM está pronto
    setTimeout(() => {
      this.initAnimation();
    }, 100);
  }

  private initAnimation(): void {
    if (!this.section?.nativeElement) return;

    // Limpar propriedades anteriores sem definir valores iniciais
    gsap.set(this.section.nativeElement, { clearProps: 'all' });

    // Criar a animação com fromTo para controle total
    const animation = gsap.fromTo(
      this.section.nativeElement,
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.section.nativeElement,
          start: 'top 90%',
          end: 'top 10%',
          scrub: true,
          markers: false,
          invalidateOnRefresh: true
        }
      }
    );

    // Armazenar referência do ScrollTrigger
    this.scrollTriggerInstance = animation.scrollTrigger as ScrollTrigger;
  }

  ngOnDestroy(): void {
    // Matar a instância específica primeiro
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill(true);
      this.scrollTriggerInstance = null;
    }

    // Limpar o elemento
    if (this.section?.nativeElement) {
      gsap.killTweensOf(this.section.nativeElement);
      gsap.set(this.section.nativeElement, {
        clearProps: 'all',
        opacity: 1,
        y: 0
      });
    }

    // Matar todos os ScrollTriggers restantes (backup)
    ScrollTrigger.getAll().forEach(st => st.kill(true));

    // Refresh do ScrollTrigger
    ScrollTrigger.refresh();
  }
}
