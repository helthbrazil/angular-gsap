// gsap-animation.service.ts
import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({
  providedIn: 'root'
})
export class GsapAnimationService {
  private scrollTriggers: ScrollTrigger[] = [];
  private animatedElements: ElementRef[] = [];
  private animations: gsap.core.Tween[] = [];

  constructor() { }

  /**
   * Registra um ScrollTrigger para limpeza posterior
   */
  registerScrollTrigger(trigger: ScrollTrigger): ScrollTrigger {
    this.scrollTriggers.push(trigger);
    return trigger;
  }

  /**
   * Registra um elemento animado para limpeza posterior
   */
  registerElement(element: ElementRef): ElementRef {
    this.animatedElements.push(element);
    return element;
  }

  /**
   * Registra uma animação GSAP para limpeza posterior
   */
  registerAnimation(animation: gsap.core.Tween): gsap.core.Tween {
    this.animations.push(animation);
    return animation;
  }

  /**
   * Cria animação FROM com registro automático
   */
  from(target: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween {
    const anim = gsap.from(target, vars);
    this.registerAnimation(anim);
    
    if (vars.scrollTrigger) {
      const triggers = ScrollTrigger.getAll().filter(st => 
        st.trigger === (typeof target === 'string' ? document.querySelector(target) : target)
      );
      triggers.forEach(st => this.registerScrollTrigger(st));
    }
    
    return anim;
  }

  /**
   * Cria animação TO com registro automático
   */
  to(target: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween {
    const anim = gsap.to(target, vars);
    this.registerAnimation(anim);
    
    if (vars.scrollTrigger) {
      const triggers = ScrollTrigger.getAll().filter(st => 
        st.trigger === (typeof target === 'string' ? document.querySelector(target) : target)
      );
      triggers.forEach(st => this.registerScrollTrigger(st));
    }
    
    return anim;
  }

  /**
   * Cria uma timeline com registro automático
   */
  timeline(vars?: gsap.TimelineVars): gsap.core.Timeline {
    const tl = gsap.timeline(vars);
    
    if (vars?.scrollTrigger) {
      const triggers = ScrollTrigger.getAll();
      const newTrigger = triggers[triggers.length - 1];
      if (newTrigger) {
        this.registerScrollTrigger(newTrigger);
      }
    }
    
    return tl;
  }

  /**
   * Limpa todas as animações e ScrollTriggers registrados
   */
  cleanupAnimations(): void {
    // Limpa ScrollTriggers
    this.scrollTriggers.forEach(st => {
      if (st && typeof st.kill === 'function') {
        st.kill(true);
      }
    });
    this.scrollTriggers = [];

    // Limpa animações
    this.animations.forEach(anim => {
      if (anim && typeof anim.kill === 'function') {
        anim.kill();
      }
    });
    this.animations = [];

    // Limpa elementos animados
    this.animatedElements.forEach(elRef => {
      if (elRef && elRef.nativeElement) {
        const el = elRef.nativeElement;
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: 'all' });
      }
    });
    this.animatedElements = [];

    // Limpeza global de ScrollTriggers remanescentes
    ScrollTrigger.getAll().forEach(st => st.kill(true));
    ScrollTrigger.refresh();
  }

  /**
   * Reseta propriedades de um elemento específico
   */
  resetElement(element: any, props: string = 'all'): void {
    gsap.killTweensOf(element);
    gsap.set(element, { clearProps: props });
  }

  /**
   * Pausa todas as animações ativas
   */
  pauseAll(): void {
    this.animations.forEach(anim => anim.pause());
  }

  /**
   * Resume todas as animações pausadas
   */
  resumeAll(): void {
    this.animations.forEach(anim => anim.resume());
  }

  /**
   * Retorna quantidade de animações ativas
   */
  getActiveAnimationsCount(): number {
    return this.animations.filter(anim => anim.isActive()).length;
  }
}