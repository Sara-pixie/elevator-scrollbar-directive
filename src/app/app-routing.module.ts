import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import { NoScrollbarPageComponent } from './components/no-scrollbar-page/no-scrollbar-page.component';
import { PageScrollPageComponent } from './components/page-scroll-page/page-scroll-page.component';
import { ElementScrollPageComponent } from './components/element-scroll-page/element-scroll-page.component';

const routes: Routes = [
  {
    path: '', component: BaseComponent,
    children: [
      {
        path: 'page-scroll', component: PageScrollPageComponent
      },
      {
        path: 'element-scroll', component: ElementScrollPageComponent
      },
      {
        path: 'no-scrollbar', component: NoScrollbarPageComponent
      },
      { path: '', redirectTo: 'no-scrollbar', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
