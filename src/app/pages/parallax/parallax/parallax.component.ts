import { Component, OnInit } from '@angular/core';
import { BaseAnimatedComponent } from 'src/app/components/base-animated.component';
import { GsapAnimationService } from 'src/app/services/gsap-animations.service';

@Component({
  selector: 'app-parallax',
  templateUrl: './parallax.component.html',
  styleUrls: ['./parallax.component.scss']
})
export class ParallaxComponent extends BaseAnimatedComponent implements OnInit {
  constructor(protected override gsapService: GsapAnimationService) {
    super(gsapService);
  }

  ngOnInit(): void {}

  initializeAnimations(): void {
    // Implement parallax animations here
  }
}
