import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { JhEmployeeSharedModule } from 'app/shared';
import {
  CoursComponent,
  CoursDetailComponent,
  CoursUpdateComponent,
  CoursDeletePopupComponent,
  CoursDeleteDialogComponent,
  coursRoute,
  coursPopupRoute
} from './';

const ENTITY_STATES = [...coursRoute, ...coursPopupRoute];

@NgModule({
  imports: [JhEmployeeSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [CoursComponent, CoursDetailComponent, CoursUpdateComponent, CoursDeleteDialogComponent, CoursDeletePopupComponent],
  entryComponents: [CoursComponent, CoursUpdateComponent, CoursDeleteDialogComponent, CoursDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhEmployeeCoursModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
