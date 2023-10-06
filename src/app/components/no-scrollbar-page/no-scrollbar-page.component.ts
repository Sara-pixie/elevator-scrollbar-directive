import { Component, OnInit } from '@angular/core';
import { LoremIpsumService } from 'src/app/services/lorem-ipsum.service';

@Component({
  templateUrl: './no-scrollbar-page.component.html'
})
export class NoScrollbarPageComponent implements OnInit {

  constructor(public loremIpsum: LoremIpsumService) { }

  ngOnInit(): void {
  }

}
