import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { JhEmployeeSharedModule } from 'app/shared';
import {
  VideoComponent,
  VideoDetailComponent,
  VideoUpdateComponent,
  VideoDeletePopupComponent,
  VideoDeleteDialogComponent,
  videoRoute,
  videoPopupRoute
} from './';

const ENTITY_STATES = [...videoRoute, ...videoPopupRoute];

@NgModule({
  imports: [JhEmployeeSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [VideoComponent, VideoDetailComponent, VideoUpdateComponent, VideoDeleteDialogComponent, VideoDeletePopupComponent],
  entryComponents: [VideoComponent, VideoUpdateComponent, VideoDeleteDialogComponent, VideoDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhEmployeeVideoModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
