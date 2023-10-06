import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderItemModel, PageHeaderItems } from 'src/app/services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  @Input('headerItems') set _headerItems(headerItems: PageHeaderItems){
    this.headerItems = headerItems.items;
  }
  headerItems: HeaderItemModel[] = [];
  currentURL: string = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentURL = this.router.url;
    this._setHeaderItemActive();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentURL = (e as NavigationEnd).urlAfterRedirects;
        this._setHeaderItemActive();
      });
  }

  onNavigate(item:HeaderItemModel) {
    this.router.navigate([item.navigationUrl]);
  }

  private _setHeaderItemActive() {
    const active = 'active';
    this.headerItems.forEach(item => {
      if (this.currentURL.startsWith(item.navigationUrl)) {
        if (!item.cssClass || (item.cssClass && !item.cssClass.includes(active))) {
          item.cssClass = item.cssClass && item.cssClass.length > 0 ? item.cssClass + ' ' + active : active;
        }
      } else {
        if (item.cssClass && item.cssClass.includes(active)) {
          item.cssClass = item.cssClass.replace(active, '');
        }
      }
    });
  }

}
