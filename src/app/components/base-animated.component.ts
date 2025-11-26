import { Component, OnDestroy } from "@angular/core";
import { GsapAnimationService } from "../services/gsap-animations.service";

@Component({
    template: ''
})
export abstract class BaseAnimatedComponent implements OnDestroy {

    constructor(protected gsapService: GsapAnimationService) { }

    /**
  * Método abstrato que deve ser implementado pelos componentes filhos
  * para inicializar suas animações
  */
    abstract initializeAnimations(): void;

    ngOnDestroy(): void {
        this.gsapService.cleanupAnimations();
    }

}