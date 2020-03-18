import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IEleve } from 'app/shared/model/eleve.model';

@Component({
  selector: 'jhi-eleve-detail',
  templateUrl: './eleve-detail.component.html'
})
export class EleveDetailComponent implements OnInit {
  eleve: IEleve;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ eleve }) => {
      this.eleve = eleve;
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}
