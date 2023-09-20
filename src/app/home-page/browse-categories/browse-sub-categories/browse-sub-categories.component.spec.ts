import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseSubCategoriesComponent } from './browse-sub-categories.component';

describe('BrowseSubCategoriesComponent', () => {
  let component: BrowseSubCategoriesComponent;
  let fixture: ComponentFixture<BrowseSubCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrowseSubCategoriesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BrowseSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
