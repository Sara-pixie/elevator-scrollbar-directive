import { Component, OnInit } from '@angular/core';
import { LoremIpsumService } from 'src/app/services/lorem-ipsum.service';

@Component({
  templateUrl: './element-scroll-page.component.html',
})
export class ElementScrollPageComponent implements OnInit {

  constructor(public loremIpsum: LoremIpsumService) { }

  ngOnInit(): void {
  }

}
