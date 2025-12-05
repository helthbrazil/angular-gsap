import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
    selector: 'app-scroll-expand',
    templateUrl: './scroll-expand.component.html',
    styleUrls: ['./scroll-expand.component.scss']
})
export class ScrollExpandComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('mediaContainer') mediaContainer!: ElementRef<HTMLDivElement>;
    @ViewChild('bgImage') bgImage!: ElementRef<HTMLDivElement>;
    @ViewChild('contentSection') contentSection!: ElementRef<HTMLElement>;
    @ViewChild('titleFirst') titleFirst!: ElementRef<HTMLHeadElement>;
    @ViewChild('titleRest') titleRest!: ElementRef<HTMLHeadElement>;

    scrollProgress = 0;
    showContent = false;
    mediaFullyExpanded = false;
    private touchStartY = 0;

    // Component props
    title = "Immersive Video Experience";
    firstWord = "Immersive";
    restOfTitle = "Video Experience";
    date = "Cosmic Journey";
    scrollToExpand = "Scroll to Expand Demo";

    mediaSrc = "https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYuZ5R8ahEEZ4aQK56LizRdfBSqeDMsmUIrJN1";
    posterSrc = "https://images.pexels.com/videos/5752729/space-earth-universe-cosmos-5752729.jpeg";
    bgImageSrc = "https://me7aitdbxq.ufs.sh/f/2wsMIGDMQRdYMNjMlBUYHaeYpxduXPVNwf8mnFA61L7rkcoS";

    private wheelHandler!: (e: WheelEvent) => void;
    private touchStartHandler!: (e: TouchEvent) => void;
    private touchMoveHandler!: (e: TouchEvent) => void;
    private touchEndHandler!: () => void;
    private scrollHandler!: () => void;

    constructor() {
        const words = this.title.split(' ');
        this.firstWord = words[0] || '';
        this.restOfTitle = words.slice(1).join(' ') || '';
    }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        this.setupScrollHandlers();
    }

    private setupScrollHandlers(): void {
        this.wheelHandler = (e: WheelEvent) => {
            if (this.mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
                this.mediaFullyExpanded = false;
                this.updateMediaSize();
            } else if (!this.mediaFullyExpanded) {
                e.preventDefault();
                const scrollDelta = e.deltaY * 0.0009;
                this.scrollProgress = Math.min(Math.max(this.scrollProgress + scrollDelta, 0), 1);
                this.updateMediaSize();

                if (this.scrollProgress >= 1) {
                    this.mediaFullyExpanded = true;
                    this.showContent = true;
                    this.animateContent();
                } else if (this.scrollProgress < 0.75) {
                    this.showContent = false;
                }
            }
        };

        this.touchStartHandler = (e: TouchEvent) => {
            this.touchStartY = e.touches[0].clientY;
        };

        this.touchMoveHandler = (e: TouchEvent) => {
            if (!this.touchStartY) return;

            const touchY = e.touches[0].clientY;
            const deltaY = this.touchStartY - touchY;

            if (this.mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
                this.mediaFullyExpanded = false;
                this.updateMediaSize();
            } else if (!this.mediaFullyExpanded) {
                e.preventDefault();
                const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
                const scrollDelta = deltaY * scrollFactor;
                this.scrollProgress = Math.min(Math.max(this.scrollProgress + scrollDelta, 0), 1);
                this.updateMediaSize();

                if (this.scrollProgress >= 1) {
                    this.mediaFullyExpanded = true;
                    this.showContent = true;
                    this.animateContent();
                } else if (this.scrollProgress < 0.75) {
                    this.showContent = false;
                }

                this.touchStartY = touchY;
            }
        };

        this.touchEndHandler = () => {
            this.touchStartY = 0;
        };

        this.scrollHandler = () => {
            if (!this.mediaFullyExpanded) {
                window.scrollTo(0, 0);
            }
        };

        window.addEventListener('wheel', this.wheelHandler, { passive: false });
        window.addEventListener('scroll', this.scrollHandler);
        window.addEventListener('touchstart', this.touchStartHandler, { passive: false });
        window.addEventListener('touchmove', this.touchMoveHandler, { passive: false });
        window.addEventListener('touchend', this.touchEndHandler);
    }

    private updateMediaSize(): void {
        if (!this.mediaContainer || !this.bgImage) return;

        const isMobile = window.innerWidth < 768;
        const mediaWidth = 300 + this.scrollProgress * (isMobile ? 650 : 1250);
        const mediaHeight = 400 + this.scrollProgress * (isMobile ? 200 : 400);
        const textTranslateX = this.scrollProgress * (isMobile ? 180 : 150);

        // Update media container size
        gsap.to(this.mediaContainer.nativeElement, {
            width: `${mediaWidth}px`,
            height: `${mediaHeight}px`,
            duration: 0.1,
            ease: 'none'
        });

        // Update background opacity
        gsap.to(this.bgImage.nativeElement, {
            opacity: 1 - this.scrollProgress,
            duration: 0.1,
            ease: 'none'
        });

        // Update title positions
        if (this.titleFirst) {
            gsap.to(this.titleFirst.nativeElement, {
                x: `-${textTranslateX}vw`,
                duration: 0.1,
                ease: 'none'
            });
        }

        if (this.titleRest) {
            gsap.to(this.titleRest.nativeElement, {
                x: `${textTranslateX}vw`,
                duration: 0.1,
                ease: 'none'
            });
        }
    }

    private animateContent(): void {
        if (this.contentSection) {
            gsap.to(this.contentSection.nativeElement, {
                opacity: 1,
                duration: 0.7,
                ease: 'power2.out'
            });
        }
    }

    ngOnDestroy(): void {
        window.removeEventListener('wheel', this.wheelHandler);
        window.removeEventListener('scroll', this.scrollHandler);
        window.removeEventListener('touchstart', this.touchStartHandler);
        window.removeEventListener('touchmove', this.touchMoveHandler);
        window.removeEventListener('touchend', this.touchEndHandler);
    }
}
