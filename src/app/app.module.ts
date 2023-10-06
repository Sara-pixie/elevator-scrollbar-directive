import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BaseComponent } from './components/base/base.component';
import { ElevatorScrollbarDirective } from './directives/elevator-scrollbar.directive';
import { ElevatorScrollbarWrapperComponent } from './directives/elevator-scrollbar-wrapper-container.component';
import { NoScrollbarPageComponent } from './components/no-scrollbar-page/no-scrollbar-page.component';
import { PageScrollPageComponent } from './components/page-scroll-page/page-scroll-page.component';
import { ElementScrollPageComponent } from './components/element-scroll-page/element-scroll-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ElevatorScrollbarDirective,
    ElevatorScrollbarWrapperComponent,
    BaseComponent,
    NoScrollbarPageComponent,
    PageScrollPageComponent,
    ElementScrollPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
