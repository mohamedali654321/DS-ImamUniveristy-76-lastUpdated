import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemComponent } from '../shared/item.component';
import { isAuthenticated } from 'src/app/core/auth/selectors';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent('Publication', ViewMode.StandalonePage)
@Component({
  selector: 'ds-publication',
  styleUrls: ['./publication.component.scss'],
  templateUrl: './publication.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicationComponent extends ItemComponent {
  public isAuthenticated$: Observable<boolean>;
ngOnInit(): void {
  this.isAuthenticated$ = this.store.pipe(select(isAuthenticated));
}

}
