import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export interface PageHeaderItems {
  items: HeaderItemModel[];
}
export interface HeaderItemModel {
  title: string;
  navigationUrl: string;
  cssClass?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private headerHeight: number = 0;
  private containerID!: string;

  private containerOffsetChange$: Subject<number> = new Subject();

  constructor() {
    window.addEventListener(
      'resize',
      this._adjustPageContentPadding.bind(this)
    );
  }

  init(pageContentElementID: string) {
    this.headerHeight = 0;
    this.containerID = pageContentElementID;
    this._adjustPageContentPadding();
  }

  containerOffsetChangeObservable(): Observable<number> {
    return this.containerOffsetChange$.asObservable();
  }
  triggerContainerOffsetChangeObservable() {
    const container = document.getElementById(this.containerID);
    if (!container) return;
    var paddingString: string = container.style.paddingTop;
    var padding = Number(paddingString.replace('px', ''));
    this.containerOffsetChange$.next(padding);
  }

  _adjustPageContentPadding() {
    const header: HTMLElement = document.getElementById('menu') as HTMLElement;
    if (!header) return;
    const paddingPX = header.offsetHeight;
    if (this.headerHeight != paddingPX) {
      // if change necessary
      this._setBodyPadding(paddingPX);
    }
  }
  private _setBodyPadding(paddingPX: number) {
    this.headerHeight = paddingPX;
    const container = document.getElementById(this.containerID);
    if (!container) return;
    container.style.paddingTop = paddingPX + 'px';
    this.containerOffsetChange$.next(paddingPX);
  }

  getDefaultLinks(): PageHeaderItems {
    return {
      items: []
    };
  }
  getBasePageLinks(): PageHeaderItems {
    return {
      items: [
        {
          navigationUrl: '/page-scroll',
          title: 'Full Page Scrollbar'
        },
        {
          navigationUrl: '/element-scroll',
          title: 'Element Inside Page Scrollbar'
        },
        {
          navigationUrl: '/no-scrollbar',
          title: 'No Scrollbar'
        }
      ]
    };
  }
}
