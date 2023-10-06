import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HeaderService, PageHeaderItems } from 'src/app/services/header.service';

@Component({
  selector: 'app-base',
  template: `
  <app-header [headerItems]="headerItems"></app-header>
  <div id="base-body" style="padding-top:70px;overflow-x: hidden">
    <router-outlet></router-outlet>
  </div>
  <app-footer></app-footer>
  `,
})
export class BaseComponent implements OnInit, AfterViewInit {
  headerItems: PageHeaderItems = this.headerService.getDefaultLinks();

  constructor(public headerService: HeaderService) {}

  ngOnInit(): void {
    this.headerItems = this.headerService.getBasePageLinks();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.headerService.init('base-body');
    }, 10);
  }
}
