import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);

@Component({
    selector: 'app-draggable',
    templateUrl: './draggable.component.html',
    styleUrls: ['./draggable.component.scss']
})
export class DraggableComponent implements OnInit, AfterViewInit {

    @ViewChild('knob', { static: true }) knob!: ElementRef;
    @ViewChild('knobValue', { static: true }) knobValue!: ElementRef;
    rotationValue: number = 0;

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.initPhysicsDrag();
        this.initCarousel();
        this.initKnob();
    }

    initPhysicsDrag() {
        Draggable.create(".physics-box", {
            type: "x,y",
            edgeResistance: 0.65,
            bounds: ".physics-container",
            inertia: true,
            onClick: function () {
                console.log("clicked");
            },
            onDragEnd: function () {
                console.log("drag ended");
            }
        });
    }

    initCarousel() {
        const wrapper = document.querySelector(".carousel-wrapper");
        const slides = gsap.utils.toArray(".slide");
        const numSlides = slides.length;
        const slideWidth = 300; // Match CSS width + margin
        const wrapWidth = numSlides * slideWidth;

        gsap.set(".carousel-content", { width: wrapWidth });

        Draggable.create(".carousel-content", {
            type: "x",
            inertia: true,
            bounds: {
                minX: -wrapWidth + (wrapper as HTMLElement).offsetWidth,
                maxX: 0
            },
            edgeResistance: 0.65,
            snap: {
                x: (value) => Math.round(value / slideWidth) * slideWidth
            }
        });
    }

    initKnob() {
        const self = this;
        Draggable.create(this.knob.nativeElement, {
            type: "rotation",
            inertia: true,
            bounds: { minRotation: 0, maxRotation: 360 },
            onDrag: function () {
                self.updateKnobValue(this['rotation']);
            },
            onThrowUpdate: function () {
                self.updateKnobValue(this['rotation']);
            }
        });
    }

    updateKnobValue(rotation: number) {
        this.rotationValue = Math.round(rotation);
        if (this.knobValue) {
            this.knobValue.nativeElement.innerText = this.rotationValue + "°";
        }
    }
}
