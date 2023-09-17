/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FileService } from 'src/app/core/shared/file.service';
import { ViewMode } from 'src/app/core/shared/view-mode.model';

@Component({
  selector: 'ds-category-items',
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.scss']
})
export class CategoryItemsComponent implements OnInit, OnChanges {
  @Input() selectedCategory: string;
  @Input() items = [];
  @Input() isLoading;
  viewMode = ViewMode.ListElement;

  constructor(
    protected fileService: FileService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
    console.log('OnChanges.isLoading: ', this.isLoading);
  }

  ngOnInit() {
    console.log('OnInit.items: ', this.items);
    console.log('OnInit.isLoading: ', this.isLoading);
  }

  // getThumbnailLink(item) {
  //   let itemThumbnail;
  //   const bitstream$href = this.fileService.retrieveFileDownloadLink('https://dspace7-api.kwaretech.com/server/api/core/bitstreams/633f017b-bf46-4f81-a91f-9f93d5e45f43/thumbnail');
  //   bitstream$href.subscribe(url => itemThumbnail = url);

  //   console.log(itemThumbnail);
  //   return itemThumbnail;
  // }
}
