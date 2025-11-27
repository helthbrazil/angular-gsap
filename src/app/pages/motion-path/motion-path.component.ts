import { Component, OnInit, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

@Component({
    selector: 'app-motion-path',
    templateUrl: './motion-path.component.html',
    styleUrls: ['./motion-path.component.scss']
})
export class MotionPathComponent implements OnInit, AfterViewInit {

    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.initPaperPlane();
        this.initOrbit();
        this.initFigureEight();
        this.initRacingCars();
        this.initSpiral();
    }

    initPaperPlane() {
        gsap.to(".paper-plane", {
            duration: 5,
            repeat: -1,
            repeatDelay: 1,
            yoyo: true,
            ease: "power1.inOut",
            motionPath: {
                path: "#path",
                align: "#path",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
            }
        });
    }

    initOrbit() {
        // Create circular motion using x and y coordinates
        const radius = 150;
        const centerX = 200;
        const centerY = 200;

        gsap.to(".planet", {
            duration: 4,
            repeat: -1,
            ease: "none",
            motionPath: {
                path: [
                    { x: centerX + radius, y: centerY },
                    { x: centerX, y: centerY + radius },
                    { x: centerX - radius, y: centerY },
                    { x: centerX, y: centerY - radius },
                    { x: centerX + radius, y: centerY }
                ],
                curviness: 2,
                autoRotate: false
            }
        });
    }

    initFigureEight() {
        gsap.to(".figure-eight-dot", {
            duration: 6,
            repeat: -1,
            ease: "none",
            motionPath: {
                path: "#figure-eight-path",
                align: "#figure-eight-path",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
            }
        });
    }

    initRacingCars() {
        // Car 1 - Red
        gsap.to(".car-1", {
            duration: 3,
            repeat: -1,
            ease: "power1.inOut",
            motionPath: {
                path: "#race-track",
                align: "#race-track",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
            }
        });

        // Car 2 - Blue (delayed start)
        gsap.to(".car-2", {
            duration: 3.5,
            repeat: -1,
            delay: 0.5,
            ease: "power1.inOut",
            motionPath: {
                path: "#race-track",
                align: "#race-track",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
            }
        });

        // Car 3 - Green (more delayed)
        gsap.to(".car-3", {
            duration: 4,
            repeat: -1,
            delay: 1,
            ease: "power1.inOut",
            motionPath: {
                path: "#race-track",
                align: "#race-track",
                autoRotate: true,
                alignOrigin: [0.5, 0.5]
            }
        });
    }

    initSpiral() {
        const tl = gsap.timeline({ repeat: -1 });

        tl.to(".spiral-particle", {
            duration: 5,
            ease: "none",
            motionPath: {
                path: "#spiral-path",
                align: "#spiral-path",
                autoRotate: false,
                alignOrigin: [0.5, 0.5]
            }
        }).to(".spiral-particle", {
            opacity: 0,
            duration: 0.5
        }).set(".spiral-particle", {
            opacity: 1
        });
    }
}
