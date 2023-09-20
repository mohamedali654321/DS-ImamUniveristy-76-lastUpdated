import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseSubCategoryComponent } from './browse-sub-category.component';

describe('BrowseSubCategoryComponent', () => {
  let component: BrowseSubCategoryComponent;
  let fixture: ComponentFixture<BrowseSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrowseSubCategoryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BrowseSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
