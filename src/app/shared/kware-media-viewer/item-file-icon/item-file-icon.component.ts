/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ds-item-file-icon',
  templateUrl: './item-file-icon.component.html',
  styleUrls: ['./item-file-icon.component.scss']
})
export class ItemFileIconComponent {
  @Input() fileFormat;

  constructor() { }

}
