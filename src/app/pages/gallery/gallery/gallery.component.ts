import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
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
  private hoverHandlers = new Map<HTMLElement, { handleMouseEnter: () => void; handleMouseLeave: () => void; handleMouseMove: (e: MouseEvent) => void }>();
  private cursorPosition = { x: 0, y: 0 };

  constructor(
    private el: ElementRef,
    protected override gsapService: GsapAnimationService
  ) {
    super(gsapService);
  }

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger, Flip);

    // Track cursor position globally
    document.addEventListener('mousemove', (e) => {
      this.cursorPosition.x = e.clientX;
      this.cursorPosition.y = e.clientY;
    });
  }

  initializeAnimations(): void {
    this.animateModernEntry();
  }

  private animateModernEntry(): void {
    const items = this.el.nativeElement.querySelectorAll('.gallery-item');
    if (!items.length) return;

    const itemsArray: HTMLElement[] = Array.from(items) as HTMLElement[];

    // Initial state: items scattered randomly off-screen
    gsap.set(itemsArray, {
      opacity: 0,
      scale: 0,
      rotation: () => gsap.utils.random(-180, 180),
      x: () => gsap.utils.random(-500, 500),
      y: () => gsap.utils.random(-500, 500),
      transformOrigin: 'center center',
      willChange: 'transform, opacity'
    });

    // Animate items into their grid positions with stagger
    itemsArray.forEach((item, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;

      // Diagonal wave delay
      const delay = (row * 0.05) + (col * 0.03);

      // Create scroll trigger for each item
      const trigger = ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          // Flip-style entry animation
          gsap.to(item, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            x: 0,
            y: 0,
            duration: 1.2,
            delay: delay,
            ease: 'elastic.out(1, 0.6)',
            onComplete: () => {
              this.setupMagneticHover(item);
              this.setupParallax(item, index);
            }
          });
        }
      });

      this.scrollTriggers.push(trigger);
    });
  }

  private setupMagneticHover(item: HTMLElement): void {
    let magneticTween: gsap.core.Tween | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const itemCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - itemCenterX;
      const deltaY = e.clientY - itemCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Magnetic effect within 150px radius
      if (distance < 150) {
        const strength = (150 - distance) / 150;
        const moveX = (deltaX / distance) * strength * 15;
        const moveY = (deltaY / distance) * strength * 15;

        if (magneticTween) magneticTween.kill();
        magneticTween = gsap.to(item, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseEnter = () => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const itemCenterY = rect.top + rect.height / 2;

      const deltaX = this.cursorPosition.x - itemCenterX;
      const deltaY = this.cursorPosition.y - itemCenterY;

      // 3D perspective tilt
      const rotateX = (deltaY / rect.height) * -15;
      const rotateY = (deltaX / rect.width) * 15;

      gsap.to(item, {
        scale: 1.08,
        rotateX: rotateX,
        rotateY: rotateY,
        z: 50,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        duration: 0.4,
        ease: 'power2.out'
      });

      // Enhance glow on hover
      gsap.to(item, {
        '--glow-opacity': 0.7,
        duration: 0.3
      });
    };

    const handleMouseLeave = () => {
      if (magneticTween) magneticTween.kill();

      gsap.to(item, {
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        z: 0,
        boxShadow: '0 4px 12px var(--gallery-shadow)',
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });

      gsap.to(item, {
        '--glow-opacity': 0.15,
        duration: 0.5
      });
    };

    item.addEventListener('mouseenter', handleMouseEnter);
    item.addEventListener('mouseleave', handleMouseLeave);
    item.addEventListener('mousemove', handleMouseMove);

    this.hoverHandlers.set(item, { handleMouseEnter, handleMouseLeave, handleMouseMove });
  }

  private setupParallax(item: HTMLElement, index: number): void {
    const row = Math.floor(index / 5);
    const col = index % 5;

    // Different parallax speeds based on position
    const speedFactor = 1 + (row % 3) * 0.1 + (col % 3) * 0.05;

    ScrollTrigger.create({
      trigger: item,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const yOffset = (progress - 0.5) * 50 * speedFactor;

        gsap.to(item, {
          y: yOffset,
          duration: 0.1,
          overwrite: 'auto'
        });
      }
    });
  }

  previewImage(url: string) {
    this.imagePreview.url = url;
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.animateModernEntry();

      setTimeout(() => {
        ScrollTrigger.refresh(true);

        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true);
        });
      }, 100);
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    // Remove all hover listeners
    this.hoverHandlers.forEach((handlers, element) => {
      element.removeEventListener('mouseenter', handlers.handleMouseEnter);
      element.removeEventListener('mouseleave', handlers.handleMouseLeave);
      element.removeEventListener('mousemove', handlers.handleMouseMove);
    });
    this.hoverHandlers.clear();

    // Kill all ScrollTriggers
    this.scrollTriggers.forEach(trigger => {
      if (trigger) {
        trigger.kill(true);
      }
    });
    this.scrollTriggers = [];

    // Kill all animations
    const items = this.el.nativeElement.querySelectorAll('.gallery-item');
    if (items.length) {
      gsap.killTweensOf(items);
      gsap.set(items, {
        clearProps: 'all',
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        rotateX: 0,
        rotateY: 0,
        z: 0,
        '--glow-opacity': 0
      });
    }

    ScrollTrigger.refresh(true);
  }
}
