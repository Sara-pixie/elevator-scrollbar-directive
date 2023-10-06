# ElevatorScrollbarDirective

![image](https://github.com/Sara-pixie/elevator-scrollbar-directive/assets/78561671/9c408f3d-a443-4176-9fbe-7f0b58079010)

## Directive
Directive code [here](https://github.com/Sara-pixie/elevator-scrollbar-directive/blob/master/src/app/directives/elevator-scrollbar.directive.ts) also code for [wrapper component](https://github.com/Sara-pixie/elevator-scrollbar-directive/blob/master/src/app/directives/elevator-scrollbar-wrapper-container.component.ts) for the directive
#### Summary
- Elevator scrollbar scrolls in the opposite direction than normal scrollbars
- thumb size is always the same (not based on content height)
- content isn't hidden and there is no overflow: auto/scroll on wrapper component
- scrollbar is superimposed over the right side of the HTML element
- can be clicked through to a covered element (pointer-events: none) except the scrollbar thumb (pointer-events: all)
- scrollbar is hidden on mobile view (media screen max 500px width)
#### How To Use
on chosen HTML element add `*elevatorScrollbar` or `*elevatorScrollbarWatchHeader="boolean"`
<br>(if boolean is true => will create top offset based on header height)
<br>The directive will wrap the HTML element and add the elevator scrollbar (hidden for mobile media screen max 500px width)
<br><br><b>*param*</b> `hideIfSmallContent` will hide scrollbar if content height is smaller than window height
<br><br>![WARNING](https://placehold.it/50x15/FF0000/FFF?text=WARNING) only one per view/page (or change IDs to ViewChild in [ElevatorScrollbarWrapperComponent](https://github.com/Sara-pixie/elevator-scrollbar-directive/blob/master/src/app/directives/elevator-scrollbar-wrapper-container.component.ts))
#### Examples
- basic
```
<div *elevatorScrollbar>
  <router-outlet></router-outlet>
</div>
```
- watch header height
```
<div *elevatorScrollbarWatchHeader="true">
  <router-outlet></router-outlet>
</div>
```
- watch header height AND hideIfSmallContent (multiple inputs)
```
<div *elevatorScrollbarWatchHeader="true;hideIfSmallContent:true">
 <router-outlet></router-outlet>
</div>
```
- basic AND hideIfSmallContent (NEED multiple inputs, so add first boolean - true/false doesn't matter)
```
<div *elevatorScrollbar="false;hideIfSmallContent:true">
 <router-outlet></router-outlet>
</div>
```
