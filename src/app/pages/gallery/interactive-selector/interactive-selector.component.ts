import { Component, OnInit, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';

interface Option {
    title: string;
    description: string;
    image: string;
    icon: string;
}

@Component({
    selector: 'app-interactive-selector',
    templateUrl: './interactive-selector.component.html',
    styleUrls: ['./interactive-selector.component.scss']
})
export class InteractiveSelectorComponent implements OnInit, AfterViewInit {
    activeIndex = 0;
    showOptions = false;

    options: Option[] = [
        {
            title: "Luxury Tent",
            description: "Cozy glamping under the stars",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            icon: "⛺"
        },
        {
            title: "Campfire Feast",
            description: "Gourmet s'mores & stories",
            image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
            icon: "🔥"
        },
        {
            title: "Lakeside Retreat",
            description: "Private dock & canoe rides",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            icon: "💧"
        },
        {
            title: "Mountain Spa",
            description: "Outdoor sauna & hot tub",
            image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
            icon: "♨️"
        },
        {
            title: "Guided Adventure",
            description: "Expert-led nature tours",
            image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
            icon: "🥾"
        }
    ];

    constructor() { }

    ngOnInit(): void { }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.showOptions = true;
            this.animateOptions();
        }, 200);
    }

    selectOption(index: number): void {
        if (index !== this.activeIndex) {
            this.activeIndex = index;
        }
    }

    private animateOptions(): void {
        gsap.from('.selector-title', {
            opacity: 0,
            y: -20,
            duration: 0.8,
            delay: 0.3,
            ease: 'power3.out'
        });

        gsap.from('.selector-subtitle', {
            opacity: 0,
            y: -20,
            duration: 0.8,
            delay: 0.6,
            ease: 'power3.out'
        });

        gsap.from('.option-card', {
            opacity: 0,
            x: -60,
            duration: 0.6,
            stagger: 0.18,
            ease: 'power3.out'
        });
    }
}
