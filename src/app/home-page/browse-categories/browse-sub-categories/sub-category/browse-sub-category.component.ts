import { Component, ViewChild, ElementRef, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { BrowseService } from 'src/app/core/browse/browse.service';
import { SortDirection, SortOptions } from 'src/app/core/cache/models/sort-options.model';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { DSpaceObjectType } from 'src/app/core/shared/dspace-object-type.model';
import { Item } from 'src/app/core/shared/item.model';
import { toDSpaceObjectListRD } from 'src/app/core/shared/operators';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from 'src/app/shared/search/models/paginated-search-options.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ds-browse-sub-category',
  templateUrl: './browse-sub-category.component.html',
  styleUrls: ['./browse-sub-category.component.scss']
})
export class BrowseSubCategoryComponent implements OnInit, OnDestroy {
  @Input() category;
  @Input() categoryIndex;
  @Output() selectedCategory = new EventEmitter<number>();
  @Output() selectedCategoryName = new EventEmitter<string>();
  @Input() setSelectedCategoryItems: (catItems: Observable<RemoteData<PaginatedList<Item>>>) => void;
  @ViewChild('selectedCategoryRef') selectedCategoryRef: ElementRef<any>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  fetchedItems: Observable<RemoteData<PaginatedList<Item>>>;

  constructor(
    protected browseService: BrowseService,
    private paginationService: PaginationService,
    private searchService: SearchService,
  ) {
    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'hp',
      pageSize: 5,
      currentPage: 1,
      maxSize: 1
    });
    this.sortConfig = new SortOptions(environment.homePage.recentSubmissions.sortField, SortDirection.DESC);
  }

  ngOnInit(): void {
    this.fetchedItems = this.searchService.search(
      new PaginatedSearchOptions({
        pagination: this.paginationConfig,
        dsoTypes: [DSpaceObjectType.ITEM],
        sort: this.sortConfig,
        query: `dc.type:${this.category.value}`
      },),
      undefined,
      undefined,
      undefined,
    ).pipe(
      toDSpaceObjectListRD()
    ) as Observable<RemoteData<PaginatedList<Item>>>;
  }

  setSelectedCategory() {
    this.selectedCategory.emit(this.categoryIndex);
    this.setSelectedCategoryItems(this.fetchedItems);
    this.selectedCategoryName.emit(this.category.value);
  }

  scrollToView() {
    this.selectedCategoryRef.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'start'
    });
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }
}
