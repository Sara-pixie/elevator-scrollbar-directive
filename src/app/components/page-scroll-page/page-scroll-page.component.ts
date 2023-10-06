import { Component, OnInit } from '@angular/core';
import { LoremIpsumService } from 'src/app/services/lorem-ipsum.service';

@Component({
  templateUrl: './page-scroll-page.component.html',
})
export class PageScrollPageComponent implements OnInit {

  constructor(public loremIpsum: LoremIpsumService) { }

  ngOnInit(): void {
  }

}
