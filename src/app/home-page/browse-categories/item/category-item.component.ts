import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FileService } from 'src/app/core/shared/file.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ds-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss']
})
export class CategoryItemComponent implements OnInit {
  @Input() item;
  thumbnailURL = new BehaviorSubject({});

  // thumbnailURL;

  
  constructor(
    protected fileService: FileService,
    protected httpClient: HttpClient
  ) { }
  // thumbnailURL?._links?.content?.href
  ngOnInit() {
    this.httpClient.get(this.item?._links?.thumbnail?.href).subscribe(res => this.thumbnailURL.next(res));

    // console.log('thumbnailURL: ', this.thumbnailURL);
    // console.log('this.item: ', this.item);
  }
}
