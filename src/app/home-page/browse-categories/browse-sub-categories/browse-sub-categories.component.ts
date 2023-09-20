/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BrowseEntrySearchOptions } from 'src/app/core/browse/browse-entry-search-options.model';
import { BrowseService } from 'src/app/core/browse/browse.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from 'src/app/core/shared/item.model';
import { RemoteData } from 'src/app/core/data/remote-data';
import { PaginatedList } from 'src/app/core/data/paginated-list.model';
import { toDSpaceObjectListRD } from 'src/app/core/shared/operators';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from 'src/app/core/cache/models/sort-options.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { DSpaceObjectType } from 'src/app/core/shared/dspace-object-type.model';
import { PaginatedSearchOptions } from 'src/app/shared/search/models/paginated-search-options.model';
import { BrowseSubCategoryComponent } from './sub-category/browse-sub-category.component';
@Component({
  selector: 'ds-browse-sub-categories',
  templateUrl: './browse-sub-categories.component.html',
  styleUrls: ['./browse-sub-categories.component.scss']
})
export class BrowseSubCategoriesComponent implements OnInit {
  @ViewChildren(BrowseSubCategoryComponent) categoriesIds: QueryList<BrowseSubCategoryComponent>;

  isLoading: boolean;
  browseCategories = [];
  items$ = new BehaviorSubject([]);
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  selectedCategory = 0;
  selectedCategoryName = '*';
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  constructor(
    private browseService: BrowseService,
    private paginationService: PaginationService,
    private searchService: SearchService,
    private router: Router
  ) {
    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'hp',
      pageSize: 5,
      currentPage: 1,
      maxSize: 1
    });
    this.sortConfig = new SortOptions(environment.homePage.recentSubmissions.sortField, SortDirection.DESC);
  }

  ngOnInit() {
    this.isLoading = true;
    this.browseService.getBrowseEntriesFor(
      new BrowseEntrySearchOptions('itemtype')
    ).subscribe(entities => {
      this.browseCategories = entities?.payload?.page;
      this.browseCategories.unshift({type:"browseEntry",value:"*"})
      const publicationIndex = this.browseCategories?.findIndex(entity => entity.value === '*');
      const element = this.browseCategories?.splice(publicationIndex, 1)[0];
      this.browseCategories?.splice(0, 0, element);
    });

    this.itemRD$ = this.searchService.search(
      new PaginatedSearchOptions({
        pagination: this.paginationConfig,
        dsoTypes: [DSpaceObjectType.ITEM],
        sort: this.sortConfig,
        query: 'dc.type:*'
      },),
      undefined,
      undefined,
      undefined,
    ).pipe(
      toDSpaceObjectListRD()
    ) as Observable<RemoteData<PaginatedList<Item>>>;
  }

  setSelectedCategory($event: number) {
    this.selectedCategory = $event;
  }

  setSelectedCategoryName($event: string) {
    this.selectedCategoryName = $event;
  }

  setSelectedCategoryItems = (catItems: Observable<RemoteData<PaginatedList<Item>>>) => {
    this.itemRD$ = catItems;
  };

  handleCurrentCategoryItmes() {
    const categoryElementRef = this.categoriesIds.toArray().find(cat => cat.categoryIndex === this.selectedCategory);
    this.itemRD$ = categoryElementRef.fetchedItems;
    categoryElementRef.scrollToView();

  }

  setSlideShowCategory(index) {
    this.selectedCategory = index;
    this.handleCurrentCategoryItmes();
  }

  getNextCategory() {
    if (!this.selectedCategory && this.selectedCategory !== 0) {
      this.selectedCategory = 0;
    } else {
      this.selectedCategory++;
    }
    this.handleCurrentCategoryItmes();
  }

  getPrevCategory() {
    this.selectedCategory--;
    this.handleCurrentCategoryItmes();
  }

  onLoadMore(currentEntity: string) {
    void this.router.navigate(['/browse/itemtype?value=', currentEntity]);
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }
}
