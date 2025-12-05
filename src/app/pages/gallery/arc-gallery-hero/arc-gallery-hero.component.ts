import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { gsap } from 'gsap';

@Component({
    selector: 'app-arc-gallery-hero',
    templateUrl: './arc-gallery-hero.component.html',
    styleUrls: ['./arc-gallery-hero.component.scss']
})
export class ArcGalleryHeroComponent implements OnInit, AfterViewInit {
    @ViewChild('arcContainer') arcContainer!: ElementRef<HTMLDivElement>;

    images = [
        'https://images.unsplash.com/photo-1755004609214-c252674df1ca?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1750218537952-0ae056c7f53a?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1755038995605-038a7345658f?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1546238232-20216dec9f72?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1753724223372-9a1df8eb5212?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1754079132860-5b37dab49daa?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1754079132962-2f6c62f14d33?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1754764987594-2236e7736115?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1755048796967-75a82d214846?q=80&w=400&auto=format&fit=crop'
    ];

    startAngle = 20;
    endAngle = 160;
    radiusLg = 480;
    radiusMd = 360;
    radiusSm = 260;
    cardSizeLg = 120;
    cardSizeMd = 100;
    cardSizeSm = 80;

    dimensions = {
        radius: this.radiusLg,
        cardSize: this.cardSizeLg
    };

    imagePositions: Array<{ x: number, y: number, angle: number, delay: number, zIndex: number }> = [];

    constructor() { }

    ngOnInit(): void {
        this.handleResize();
    }

    ngAfterViewInit(): void {
        // Animações CSS handles the fade-in
    }

    @HostListener('window:resize')
    onResize(): void {
        this.handleResize();
    }

    private handleResize(): void {
        const width = window.innerWidth;
        if (width < 640) {
            this.dimensions = { radius: this.radiusSm, cardSize: this.cardSizeSm };
        } else if (width < 1024) {
            this.dimensions = { radius: this.radiusMd, cardSize: this.cardSizeMd };
        } else {
            this.dimensions = { radius: this.radiusLg, cardSize: this.cardSizeLg };
        }
        this.calculatePositions();
    }

    private calculatePositions(): void {
        const count = Math.max(this.images.length, 2);
        const step = (this.endAngle - this.startAngle) / (count - 1);

        this.imagePositions = this.images.map((_, i) => {
            const angle = this.startAngle + step * i;
            const angleRad = (angle * Math.PI) / 180;
            const x = Math.cos(angleRad) * this.dimensions.radius;
            const y = Math.sin(angleRad) * this.dimensions.radius;

            return {
                x,
                y,
                angle,
                delay: i * 100,
                zIndex: count - i
            };
        });
    }
}
