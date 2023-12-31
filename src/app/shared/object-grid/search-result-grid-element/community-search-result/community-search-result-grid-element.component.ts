import { Component, Input } from '@angular/core';
import { Community } from '../../../../core/shared/community.model';
import { SearchResultGridElementComponent } from '../search-result-grid-element.component';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { hasNoValue, hasValue } from '../../../empty.util';
import { followLink } from '../../../utils/follow-link-config.model';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { LocaleService } from 'src/app/core/locale/locale.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { isAuthenticated } from 'src/app/core/auth/selectors';

@Component({
  selector: 'ds-community-search-result-grid-element',
  styleUrls: [
    '../search-result-grid-element.component.scss',
    'community-search-result-grid-element.component.scss',
  ],
  templateUrl: 'community-search-result-grid-element.component.html',
})
/**
 * Component representing a grid element for a community search result
 */
@listableObjectComponent(CommunitySearchResult, ViewMode.GridElement)
export class CommunitySearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult,Community> {
  private _dso: Community;

  constructor(
    public dsoNameService: DSONameService,
    protected linkService: LinkService,
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    public localeService: LocaleService, //kware-edit
    public store: Store<AppState>, //kware-edit
  ) {
    super(dsoNameService, truncatableService, bitstreamDataService,linkService,localeService,store);
  }

  // @ts-ignore
  @Input() set dso(dso: Community) {
    this._dso = dso;
    if (hasValue(this._dso) && hasNoValue(this._dso.logo)) {
      this.linkService.resolveLink<Community>(this._dso, followLink('logo'));
    }
  }

  get dso(): Community {
    return this._dso;
  }
}
