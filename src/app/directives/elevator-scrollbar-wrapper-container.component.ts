import { Component, Input, TemplateRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { HeaderService } from '../services/header.service';

/**
 * @description
 * Used for `ElevatorScrollbarDirective`
 */
@UntilDestroy()
@Component({
  template: `
    <div id="elevator-scrollbar-wrapper">
      <div id="elevator-scrollbar-contents">
        <ng-container *ngTemplateOutlet="template"></ng-container>
      </div>
      <div id="elevator-scrollbar-scrollbar">
        <div id="elevator-scrollbar-track">
          <div id="elevator-scrollbar-filled-track"></div>
          <div id="elevator-scrollbar-thumb"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #elevator-scrollbar-wrapper {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: stretch;
      overflow-x: hidden;
      --scrollbar-thumb-width: 35px;
      --scrollbar-thumb-height: 60px;
      --scrollbar-right-offset: 15px;
      --scrollbar-width: var(--scrollbar-thumb-width);
      --scrollbar-track-width: 4px;
      --scrollbar-top-offset: 0px;
      --scrollbar-contents-position-top: 0px;
      --scrollbar-contents-height: 0px;
      --scrolled-percentage: 0;
      --track-centering: calc(calc(var(--scrollbar-width) - calc(var(--scrollbar-track-width) / 2)) / 2);
      --thumb-centering: -15px;
      --track-height: calc(calc(calc(100vh - var(--scrollbar-top-offset)) * var(--scrolled-percentage)) / 100);
      --thumb-bottom-offset: 0px;
    }
    #elevator-scrollbar-contents {
      flex-grow: 1;
      width: 100vw;
    }
    #elevator-scrollbar-scrollbar {
      position: absolute;
      right: var(--scrollbar-right-offset);
      top: var(--scrollbar-contents-position-top);
      width: var(--scrollbar-width);
      height: var(--scrollbar-contents-height);
      pointer-events: none;
    }
    #elevator-scrollbar-track {
      background-color: #d5ebeb;
      width: var(--scrollbar-track-width);
      height: calc(100vh - var(--scrollbar-top-offset));
      max-height: min(calc(100vh - var(--scrollbar-top-offset)), var(--scrollbar-contents-height));
      position: sticky;
      position: -webkit-sticky;
      top: var(--scrollbar-top-offset);
      margin-left: var(--track-centering);
    }
    #elevator-scrollbar-filled-track {
      background-color: #006b6c;
      width: var(--scrollbar-track-width);
      height: var(--track-height);
      max-height: min(calc(100vh - var(--scrollbar-top-offset)), var(--scrollbar-contents-height));
      position: absolute;
      bottom: 0;
    }
    #elevator-scrollbar-thumb {
      width: var(--scrollbar-thumb-width);
      height: var(--scrollbar-thumb-height);
      /**import hover img now to avoid lagg on first hover*/
      background-image: url("/assets/icons/elevator-thumb-hover.svg");
      background-image: url("/assets/icons/elevator-thumb.svg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: initial;
      background-color: transparent;
      pointer-events: all;
      cursor: pointer;
      position: absolute;
      bottom: min(var(--thumb-bottom-offset), calc(var(--scrollbar-contents-height) - var(--scrollbar-top-offset) - var(--scrollbar-thumb-height)));
      left: var(--thumb-centering);
    }
    #elevator-scrollbar-thumb:hover {
      background-image: url("/assets/icons/elevator-thumb-hover.svg");
    }
    @media (max-width: 500px) {
      #elevator-scrollbar-scrollbar {
        display: none !important;
      }
    }
  `]
})
export class ElevatorScrollbarWrapperComponent implements AfterViewInit, OnDestroy {
  @HostListener('window:scroll', ['$event'])
    onScroll(event: Event) {
      this._handleScroll(event);
    }
  @Input() template!: TemplateRef<any>;
  @Input() hideScrollbarIfContentsSmallerThanViewHeight: boolean = false;
  @Input() set watchHeader(watchHeader: boolean) {
    this.isWatchHeader = watchHeader ? watchHeader : false;
  }
  contentsResizeObserver?: ResizeObserver;
  isWatchHeader: boolean = false;
  scrollbarReady: boolean = false;

  constructor(private headerService: HeaderService) {}

  ngAfterViewInit(): void {
    this._checkScrollbarVisibility();
    setTimeout(() => {
      var isFirstLoad: boolean = true;
      if(this.isWatchHeader) {
        this.headerService
          .containerOffsetChangeObservable()
          .pipe(untilDestroyed(this))
          .subscribe((offset: number) => {
            this._getContentsPositionTopOffset();
            this._setScrollbarTopOffset(offset);
            if(isFirstLoad) this._afterScrollbarTopOfsetFunctions();
          });
          this.headerService.triggerContainerOffsetChangeObservable();
      } else {
        this._getContentsPositionTopOffset();
        this._setScrollbarTopOffset(0);
        this._afterScrollbarTopOfsetFunctions();
      }
    }, 1); // time needed for page animations that can change header height
  }

  ngOnDestroy(): void {
    this.contentsResizeObserver?.disconnect();
    this._removeAllEventListeners();
  }

  private _afterScrollbarTopOfsetFunctions() {
    this._getContentsHeight();
    this._checkScrollbarVisibility();
    this._setupThumbDrag();
  }

  private _setupThumbDrag() {
    const thumb = document.getElementById('elevator-scrollbar-thumb') as HTMLElement;
    if(!thumb) return;
    thumb.onmousedown = this._onStartThumbDrag.bind(this);
    thumb.ontouchstart = this._onStartThumbDrag.bind(this);
  }
  private _onStartThumbDrag(event: MouseEvent|TouchEvent) {
    var mouseY = event instanceof MouseEvent ? event.screenY : event.touches.item(0)?.screenY;
    const mouseMoveHandler = (event: MouseEvent|TouchEvent) => {
      event.preventDefault();
      const scrollbarTrack = document.getElementById('elevator-scrollbar-track') as HTMLElement;
      const scrollbar = document.getElementById('elevator-scrollbar-scrollbar') as HTMLElement;
      if(!scrollbarTrack || !scrollbar) return;
      // get base info
      var newMouseY = event instanceof MouseEvent ? event.screenY : event.touches.item(0)?.screenY;
      if(!newMouseY) newMouseY = 0;
      if(!mouseY) mouseY = 0;
      var contentsHeight = this._findContentHeight();
      var scrollbarTrackHeight = Number(getComputedStyle(scrollbarTrack).getPropertyValue('height').replace('px',''));
      var topOffset = this._findContentsTopOffset();
      // set current and previous cursor Y position percentage relative to track
      var cursorYpositionRelativeToScrollbarTrack = newMouseY - topOffset;
      var cursorYpositionPercentage = 100 - ((cursorYpositionRelativeToScrollbarTrack * 100) / scrollbarTrackHeight);
      var prevCursorYpositionRelativeToScrollbarTrack = mouseY - topOffset;
      var prevCursorYpositionPercentage = 100 - ((prevCursorYpositionRelativeToScrollbarTrack * 100) / scrollbarTrackHeight);
      // calculate scrollBy
      var scrollByPercent = prevCursorYpositionPercentage - cursorYpositionPercentage;
      var scrollBy = ((contentsHeight * scrollByPercent) / 100) * -1;
      // calculate if scrolling within contents
      var newScreenY = window.scrollY + scrollBy;
      var scrollingTopOffset = topOffset;
      var assignedScrollbarTopOffset = this._findScrollbarTopOffset();
      if(assignedScrollbarTopOffset > 0) {
        scrollingTopOffset = scrollingTopOffset - assignedScrollbarTopOffset;
      }
      var willScrollOverContentsTop: boolean = newScreenY < scrollingTopOffset;
      if(willScrollOverContentsTop) {
        scrollBy = scrollingTopOffset - window.scrollY;
      }
      var willScrollOverContentsBottom: boolean = (newScreenY + window.innerHeight) > (topOffset + contentsHeight);
      if(willScrollOverContentsBottom) {
        scrollBy = topOffset + contentsHeight - window.innerHeight - window.scrollY;
      }
      // scroll if condidtions met
      if(cursorYpositionRelativeToScrollbarTrack != prevCursorYpositionRelativeToScrollbarTrack) {
        window.scrollBy(0, scrollBy);
        mouseY = newMouseY;
      }
    };
    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('touchmove', mouseMoveHandler);
      document.removeEventListener('touchend', mouseUpHandler);
    }
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    document.addEventListener('touchmove', mouseMoveHandler);
    document.addEventListener('touchend', mouseUpHandler);
  }

  private _removeAllEventListeners() {
    const thumb = document.getElementById('elevator-scrollbar-thumb') as HTMLElement;
    if(thumb) {
      thumb.onmousedown = null;
      thumb.ontouchstart = null;
    }
  }

  private _checkScrollbarVisibility() {
    const scrollbar = document.getElementById('elevator-scrollbar-scrollbar');
    if(!scrollbar) return;
    if(!this.scrollbarReady) {
      scrollbar.style.display = 'none';
    } else if(this.hideScrollbarIfContentsSmallerThanViewHeight && this.scrollbarReady) {
      scrollbar.style.display = '';
      if(this._findContentHeight() < window.innerHeight) {
        scrollbar.style.display = 'none';
      }
    } else if(this.scrollbarReady) {
      scrollbar.style.display = '';
    }
  }

  private _handleScroll(event: Event) {
    this._getScrolledPercentage();
  }

  private _getScrolledPercentage(contentHeight?: number) {
    const contents = document.getElementById('elevator-scrollbar-contents');
    if(!contents) return;
    var windowHeight = window.innerHeight;
    var divHeight = contentHeight ? contentHeight : this._findContentHeight();
    var docScroll = window.scrollY;
    var divPosition = this._findContentsTopOffset();
    var hiddenAfter = (divPosition + divHeight) - (docScroll + windowHeight);
    var scrolledPercentage = (100 - (((windowHeight + hiddenAfter) * 100) / divHeight)) + ((windowHeight * 100)/divHeight);
    this._setScrolledPercentage(scrolledPercentage);
  }

  private _findContentsTopOffset(): number {
    const contents = document.getElementById('elevator-scrollbar-contents');
    if(!contents) return 0;
    return contents.getBoundingClientRect().top + (window.scrollY ? window.scrollY : (document.documentElement || document.body).scrollTop);
  }
  private _findScrollbarTopOffset(): number {
    const wrapper = document.getElementById('elevator-scrollbar-wrapper');
    if(!wrapper) return 0;
    return Number(getComputedStyle(wrapper).getPropertyValue('--scrollbar-top-offset').replace('px',''));
  }

  private _getContentsPositionTopOffset() {
    setTimeout(() => {
      var topOffset: number = this._findContentsTopOffset();
      this._setScrollbarContentsPositionTop(topOffset);
      // show scrollbar when ready
      this.scrollbarReady = true;
      this._checkScrollbarVisibility();
    }, 1); // time needed for contents top offset to complete
  }
  private _getContentsHeight() {
    this._setScrollbarContentsHeight(this._findContentHeight());
    // set observer
    const contents = document.getElementById('elevator-scrollbar-contents');
    if(!contents) return;
    this.contentsResizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      this._setScrollbarContentsHeight(this._findContentHeight());
      this._checkScrollbarVisibility();
    });
    this.contentsResizeObserver.observe(contents);
  }
  private _findContentHeight(): number {
    const contents = document.getElementById('elevator-scrollbar-contents');
    if(!contents) return 0;
    return Number(getComputedStyle(contents).getPropertyValue('height').replace('px',''));
  }

  private _setScrollbarContentsPositionTop(topOffset: number) {
    const wrapper = document.getElementById('elevator-scrollbar-wrapper');
    if(!wrapper) return;
    wrapper.style.setProperty('--scrollbar-contents-position-top', topOffset + 'px');
  }
  private _setScrollbarTopOffset(offset: number) {
    const wrapper = document.getElementById('elevator-scrollbar-wrapper');
    if(!wrapper) return;
    wrapper.style.setProperty('--scrollbar-top-offset', offset + 'px');
  }
  private _setScrollbarContentsHeight(height: number) {
    const wrapper = document.getElementById('elevator-scrollbar-wrapper');
    if(!wrapper) return;
    wrapper.style.setProperty('--scrollbar-contents-height', height + 'px');
    this._getScrolledPercentage(height);
  }
  private _setScrolledPercentage(percentage: number) {
    const wrapper = document.getElementById('elevator-scrollbar-wrapper') as HTMLElement;
    if(!wrapper) return;
    wrapper.style.setProperty('--scrolled-percentage', percentage.toString());
    // check thumb top/bottom offset
    const thumbBottomOffsetCalculation: string = 'calc(var(--track-height) - calc(var(--scrollbar-thumb-height) / 2))';
    wrapper.style.setProperty('--thumb-bottom-offset', thumbBottomOffsetCalculation);
    const thumb = document.getElementById('elevator-scrollbar-thumb') as HTMLElement;
    if(!thumb) return;
    const thumbHeight: number = 60;
    const thumbBottomOffset: number = Number(getComputedStyle(thumb).getPropertyValue('bottom').replace('px',''));
    const thumbTopOffset: number = Number(getComputedStyle(thumb).getPropertyValue('top').replace('px',''));
    if(thumbBottomOffset < 0) {
      wrapper.style.setProperty('--thumb-bottom-offset', '0px');
    }
    if(thumbTopOffset < 0) {
      var newBottomOffset: number = thumbBottomOffset - (thumbHeight / 2);
      wrapper.style.setProperty('--thumb-bottom-offset', newBottomOffset+'px');
    }
  }
}
