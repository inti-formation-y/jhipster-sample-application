import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { ICours, Cours } from 'app/shared/model/cours.model';
import { CoursService } from './cours.service';
import { IEleve } from 'app/shared/model/eleve.model';
import { EleveService } from 'app/entities/eleve';

@Component({
  selector: 'jhi-cours-update',
  templateUrl: './cours-update.component.html'
})
export class CoursUpdateComponent implements OnInit {
  isSaving: boolean;

  eleves: IEleve[];
  dateAjoutDp: any;

  editForm = this.fb.group({
    id: [],
    titre: [],
    dateAjout: [],
    eleve: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected coursService: CoursService,
    protected eleveService: EleveService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ cours }) => {
      this.updateForm(cours);
    });
    this.eleveService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEleve[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEleve[]>) => response.body)
      )
      .subscribe((res: IEleve[]) => (this.eleves = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(cours: ICours) {
    this.editForm.patchValue({
      id: cours.id,
      titre: cours.titre,
      dateAjout: cours.dateAjout,
      eleve: cours.eleve
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const cours = this.createFromForm();
    if (cours.id !== undefined) {
      this.subscribeToSaveResponse(this.coursService.update(cours));
    } else {
      this.subscribeToSaveResponse(this.coursService.create(cours));
    }
  }

  private createFromForm(): ICours {
    return {
      ...new Cours(),
      id: this.editForm.get(['id']).value,
      titre: this.editForm.get(['titre']).value,
      dateAjout: this.editForm.get(['dateAjout']).value,
      eleve: this.editForm.get(['eleve']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICours>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackEleveById(index: number, item: IEleve) {
    return item.id;
  }
}
