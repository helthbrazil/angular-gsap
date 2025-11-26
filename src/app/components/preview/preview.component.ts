import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { Image } from 'src/app/pages/gallery/gallery/gallery.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @Input() image!: Image;

  private observer!: MutationObserver;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Observa quando o IMG nasce no DOM
    this.observer = new MutationObserver(() => {
      const img = this.el.nativeElement.querySelector('.transparent img');
      if (img) {
        this.animateOpen();
      }
    });

    this.observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true
    });
  }

  ngAfterViewInit(): void {}

  ngOnChanges(): void {
    if (this.image?.url) {
      document.body.classList.add('no-scroll');
    }
  }

  ngOnDestroy(): void {
    document.body.classList.remove('no-scroll');
    if (this.observer) this.observer.disconnect();
  }

  @HostListener('document:keydown.escape')
  onEscapeKeydown() {
    this.closePreview();
  }

  // ENTRADA SUAVE
  animateOpen() {
    const img = this.el.nativeElement.querySelector('.transparent img');
    if (!img) return;

    gsap.fromTo(
      img,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out'
      }
    );
  }

  // SAÍDA SUAVE
  animateClose(callback: () => void) {
    const img = this.el.nativeElement.querySelector('.transparent img');
    if (!img) return callback();

    gsap.to(img, {
      opacity: 0,
      y: 40,
      duration: 0.25,
      ease: 'power1.in',
      onComplete: callback
    });
  }

  closePreview() {
    this.animateClose(() => {
      this.image.url = undefined;
      document.body.classList.remove('no-scroll');
    });
  }
}
