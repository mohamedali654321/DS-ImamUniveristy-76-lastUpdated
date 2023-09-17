/* eslint-disable @typescript-eslint/no-empty-function */
import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BrowseEntrySearchOptions } from 'src/app/core/browse/browse-entry-search-options.model';
import { BrowseService } from 'src/app/core/browse/browse.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from 'src/app/core/shared/item.model';
import { BrowseCategoryComponent } from './category/browse-category.component';
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
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
@Component({
  selector: 'ds-browse-categories',
  templateUrl: './browse-categories.component.html',
  styleUrls: ['./browse-categories.component.scss']
})
export class BrowseCategoriesComponent implements OnInit {
  @ViewChildren(BrowseCategoryComponent) categoriesIds: QueryList<BrowseCategoryComponent>;

  isLoading: boolean;
  browseCategories = [];
  items$ = new BehaviorSubject([]);
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  selectedCategory = 0;
  selectedCategoryName='Publication';
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
      new BrowseEntrySearchOptions('entityType')
    ).subscribe(entities => {
      this.browseCategories = entities?.payload?.page;
      const publicationIndex = this.browseCategories?.findIndex(entity => entity.value === 'Publication');
      const element = this.browseCategories?.splice(publicationIndex, 1)[0];
      this.browseCategories?.splice(0, 0, element);
    });

    // this.browseService
    // .getBrowseItemsFor(
    //   'Publication',
    //   '',
    //   new BrowseEntrySearchOptions('entityType'))
    // .subscribe(item => {
    //   this.items$.next(item?.payload?.page);
    //   this.isLoading = false;
    // });


    this.itemRD$ = this.searchService.search(
      new PaginatedSearchOptions({
        pagination: this.paginationConfig,
        dsoTypes: [DSpaceObjectType.ITEM],
        sort: this.sortConfig,
        query:'dspace.entity.type:Publication'
      },),
      undefined,
      undefined,
      undefined,
    ).pipe(
      toDSpaceObjectListRD()
    ) as Observable<RemoteData<PaginatedList<Item>>>;

  //  this.itemRD$= this.browseService
  //     .getBrowseItemsFor(
  //       'Publication',
  //       '',
  //       new BrowseEntrySearchOptions('entityType',this.paginationConfig,this.sortConfig)).pipe(
  //       ) as Observable<RemoteData<PaginatedList<Item>>>;

  //       this.itemRD$.subscribe(item=>{
  //         console.log(item.payload.page)
  //       })
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     const publicationCategory = this.categoriesIds?.first;
  //     console.log('publicationCategory', publicationCategory);
  //     this.items$.next(publicationCategory?.fetchedItems);
  //     this.isLoading = false;
  //   }, 2000);
  // }

  setSelectedCategory($event: number) {
    this.selectedCategory = $event;
  }

  setSelectedCategoryName($event: string) {
    this.selectedCategoryName = $event;
    console.log(this.selectedCategoryName)
  }

  setSelectedCategoryItems = (catItems: Observable<RemoteData<PaginatedList<Item>>>) => {
    // this.items$.next(catItems);
    this.itemRD$=catItems
  };

  handleCurrentCategoryItmes() {
    const categoryElementRef = this.categoriesIds.toArray().find(cat => cat.categoryIndex === this.selectedCategory);
    
    // this.items$.next(categoryElementRef.fetchedItems);
    this.itemRD$=categoryElementRef.fetchedItems;
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

  onLoadMore(currentEntity:string){
    this.router.navigate(['/browse/entityType?value=',currentEntity]);
  }
  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }
}
