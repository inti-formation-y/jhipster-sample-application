import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { JhEmployeeSharedModule } from 'app/shared';
import {
  EleveComponent,
  EleveDetailComponent,
  EleveUpdateComponent,
  EleveDeletePopupComponent,
  EleveDeleteDialogComponent,
  eleveRoute,
  elevePopupRoute
} from './';

const ENTITY_STATES = [...eleveRoute, ...elevePopupRoute];

@NgModule({
  imports: [JhEmployeeSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [EleveComponent, EleveDetailComponent, EleveUpdateComponent, EleveDeleteDialogComponent, EleveDeletePopupComponent],
  entryComponents: [EleveComponent, EleveUpdateComponent, EleveDeleteDialogComponent, EleveDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhEmployeeEleveModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
