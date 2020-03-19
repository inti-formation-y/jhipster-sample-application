import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ICours, Cours } from 'app/shared/model/cours.model';
import { CoursService } from './cours.service';
import { IEleve } from 'app/shared/model/eleve.model';
import { EleveService } from 'app/entities/eleve/eleve.service';

@Component({
  selector: 'jhi-cours-update',
  templateUrl: './cours-update.component.html'
})
export class CoursUpdateComponent implements OnInit {
  isSaving = false;
  eleves: IEleve[] = [];
  dateAjoutDp: any;

  editForm = this.fb.group({
    id: [],
    titre: [],
    dateAjout: [],
    eleve: []
  });

  constructor(
    protected coursService: CoursService,
    protected eleveService: EleveService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cours }) => {
      this.updateForm(cours);

      this.eleveService.query().subscribe((res: HttpResponse<IEleve[]>) => (this.eleves = res.body || []));
    });
  }

  updateForm(cours: ICours): void {
    this.editForm.patchValue({
      id: cours.id,
      titre: cours.titre,
      dateAjout: cours.dateAjout,
      eleve: cours.eleve
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
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
      id: this.editForm.get(['id'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      dateAjout: this.editForm.get(['dateAjout'])!.value,
      eleve: this.editForm.get(['eleve'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICours>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IEleve): any {
    return item.id;
  }
}
