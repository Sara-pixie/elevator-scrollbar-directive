import { ComponentFactoryResolver, ComponentRef, Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { ElevatorScrollbarWrapperComponent } from "./elevator-scrollbar-wrapper-container.component";

/**
 * @usageNotes
 * on chosen HTML element add `*elevatorScrollbar` or `*elevatorScrollbarWatchHeader="boolean"`
 * (if boolean is true => will create top offset based on header height)
 *
 * The directive will wrap the HTML element and add the elevator scrollbar (hidden for mobile media screen max 500px width)
 * @param hideIfSmallContent will hide scrollbar if content height is smaller than window height
 * @see {@link ElevatorScrollbarWrapperComponent}
 * @warning only one per view/page (or change IDs to ViewChild in {@link ElevatorScrollbarWrapperComponent})
 * @example `basic`
 * <div *elevatorScrollbar>
 *  <router-outlet></router-outlet>
 * </div>
 * `watch header height`
 * <div *elevatorScrollbarWatchHeader="true">
 *  <router-outlet></router-outlet>
 * </div>
 * `watch header height AND hideIfSmallContent (multiple inputs)`
 * <div *elevatorScrollbarWatchHeader="true;hideIfSmallContent:true">
 *  <router-outlet></router-outlet>
 * </div>
 * `basic AND hideIfSmallContent (NEED multiple inputs, so add first boolean - true/false doesn't matter)`
 * <div *elevatorScrollbar="false;hideIfSmallContent:true">
 *  <router-outlet></router-outlet>
 * </div>
 * @summary
 * - Elevator scrollbar scrolls in the opposite direction than normal scrollbars
 * - thumb size is always the same (not based on content height)
 * - content isn't hidden and there is no overflow: auto/scroll on wrapper component
 * - scrollbar is superimposed over the right side of the HTML element
 * - can be clicked through to a covered element (pointer-events: none) except the scrollbar thumb (pointer-events: all)
 * - scrollbar is hidden on mobile view (media screen max 500px width)
 */
@Directive({
  selector: '[elevatorScrollbar], [elevatorScrollbarWatchHeader]',
})
export class ElevatorScrollbarDirective {
  private wrapperContainer: ComponentRef<ElevatorScrollbarWrapperComponent>;
  @Input() set elevatorScrollbar(value: boolean) {
    this.wrapperContainer.instance.watchHeader = false;
  }
  @Input() set elevatorScrollbarWatchHeader(value: boolean) {
    this.wrapperContainer.instance.watchHeader = value ? value : true;
  }
  @Input() set elevatorScrollbarHideIfSmallContent (hide: boolean) {
    this.wrapperContainer.instance.hideScrollbarIfContentsSmallerThanViewHeight = hide;
  }
  @Input() set elevatorScrollbarWatchHeaderHideIfSmallContent (hide: boolean) {
    this.wrapperContainer.instance.hideScrollbarIfContentsSmallerThanViewHeight = hide;
  }

  constructor(
    templateRef: TemplateRef<any>,
    viewContainerRef: ViewContainerRef,
    componentFactoryResolver: ComponentFactoryResolver,
  ) {
    const containerFactory = componentFactoryResolver.resolveComponentFactory(ElevatorScrollbarWrapperComponent);
    this.wrapperContainer = viewContainerRef.createComponent(containerFactory);
    this.wrapperContainer.instance.template = templateRef;
  }

}
