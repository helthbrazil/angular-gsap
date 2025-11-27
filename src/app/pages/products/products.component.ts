import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BaseAnimatedComponent } from 'src/app/components/base-animated.component';
import { GsapAnimationService } from 'src/app/services/gsap-animations.service';

interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    description: string;
    emoji: string;
    color: string;
}

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseAnimatedComponent implements OnInit, AfterViewInit, OnDestroy {

    products: Product[] = [
        {
            id: 1,
            name: 'iPhone 15 Pro',
            category: 'Smartphone',
            price: '$999',
            description: 'The most powerful iPhone ever with titanium design',
            emoji: '📱',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            id: 2,
            name: 'Nike Air Max',
            category: 'Footwear',
            price: '$180',
            description: 'Iconic comfort meets modern style',
            emoji: '👟',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            id: 3,
            name: 'Premium T-Shirt',
            category: 'Apparel',
            price: '$45',
            description: 'Luxury cotton blend for everyday comfort',
            emoji: '👕',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
            id: 4,
            name: 'MacBook Pro',
            category: 'Laptop',
            price: '$2,499',
            description: 'Supercharged by M3 Pro chip',
            emoji: '💻',
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            id: 5,
            name: 'Apple Watch',
            category: 'Wearable',
            price: '$399',
            description: 'Your health companion on your wrist',
            emoji: '⌚',
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        },
        {
            id: 6,
            name: 'AirPods Pro',
            category: 'Audio',
            price: '$249',
            description: 'Immersive sound with active noise cancellation',
            emoji: '🎧',
            color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
        },
        {
            id: 7,
            name: 'Designer Jacket',
            category: 'Apparel',
            price: '$320',
            description: 'Premium quality meets timeless design',
            emoji: '👔',
            color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
        },
        {
            id: 8,
            name: 'PlayStation 5',
            category: 'Gaming',
            price: '$499',
            description: 'Next-gen gaming experience',
            emoji: '🎮',
            color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        },
        {
            id: 9,
            name: 'Canon Camera',
            category: 'Photography',
            price: '$1,299',
            description: 'Capture life in stunning detail',
            emoji: '📷',
            color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
        },
        {
            id: 10,
            name: 'Ray-Ban Sunglasses',
            category: 'Accessories',
            price: '$159',
            description: 'Classic style with UV protection',
            emoji: '🕶️',
            color: 'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)'
        }
    ];

    private scrollTriggers: ScrollTrigger[] = [];

    constructor(
        private el: ElementRef,
        protected override gsapService: GsapAnimationService
    ) {
        super(gsapService);
    }

    ngOnInit(): void {
        gsap.registerPlugin(ScrollTrigger);
    }

    ngAfterViewInit(): void {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            this.initializeAnimations();

            // Refresh ScrollTrigger after animations are set up
            setTimeout(() => {
                ScrollTrigger.refresh(true);
            }, 100);
        });
    }

    initializeAnimations(): void {
        this.initHeroAnimation();
        this.initProductAnimations();
    }

    initHeroAnimation() {
        const hero = this.el.nativeElement.querySelector('.hero-section');

        if (hero) {
            gsap.from(hero.querySelector('h1'), {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            });

            gsap.from(hero.querySelector('p'), {
                opacity: 0,
                y: 30,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out'
            });
        }
    }

    initProductAnimations() {
        const products = this.el.nativeElement.querySelectorAll('.product-card');

        products.forEach((product: HTMLElement, index: number) => {
            // Initial state - always start hidden
            gsap.set(product, {
                opacity: 0,
                y: 100,
                scale: 0.8,
                rotateX: -15
            });

            // Scroll-triggered animation
            const trigger = ScrollTrigger.create({
                trigger: product,
                start: 'top 85%',
                onEnter: () => {
                    gsap.to(product, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        duration: 1,
                        delay: (index % 3) * 0.1,
                        ease: 'power3.out'
                    });
                },
                onLeaveBack: () => {
                    // Reset when scrolling back up
                    gsap.to(product, {
                        opacity: 0,
                        y: 100,
                        scale: 0.8,
                        rotateX: -15,
                        duration: 0.3
                    });
                }
            });

            this.scrollTriggers.push(trigger);

            // Hover animation
            product.addEventListener('mouseenter', () => {
                gsap.to(product, {
                    y: -10,
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            product.addEventListener('mouseleave', () => {
                gsap.to(product, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });
    }

    override ngOnDestroy(): void {
        super.ngOnDestroy();

        // Kill all scroll triggers
        this.scrollTriggers.forEach(trigger => trigger.kill());
        this.scrollTriggers = [];

        // Reset all products to visible state
        const products = this.el.nativeElement.querySelectorAll('.product-card');
        if (products.length) {
            gsap.set(products, {
                clearProps: 'all'
            });
        }

        ScrollTrigger.refresh();
    }
}
