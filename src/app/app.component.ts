import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  selectedIndex = 0;
  theme: 'dark' = 'dark'; // Fixed to dark theme

  constructor(private router: Router) {
    // Atualiza a tab selecionada quando muda de rota via URL
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const index = this.tabsRoutes.indexOf(event.urlAfterRedirects);
        if (index !== -1) this.selectedIndex = index;

        // Rola para o topo da página quando a rota muda
        window.scrollTo(0, 0);
        // Força o scroll para o topo em navegadores que não respeitam window.scrollTo
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    });
  }

  onTabChange(index: number) {
    this.router.navigate([this.tabsRoutes[index]]);
  }

  tabsRoutes = ['/basic', '/gallery', '/parallax', '/timeline', '/draggable', '/motion-path', '/products', '/effects'];

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  }
}
