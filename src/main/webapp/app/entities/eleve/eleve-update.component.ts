import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IEleve, Eleve } from 'app/shared/model/eleve.model';
import { EleveService } from './eleve.service';

@Component({
  selector: 'jhi-eleve-update',
  templateUrl: './eleve-update.component.html'
})
export class EleveUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    photo: [],
    photoContentType: [],
    nom: [],
    prenom: [],
    adresse: [],
    email: [],
    mobile: [],
    dateNaissance: [],
    classe: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected eleveService: EleveService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ eleve }) => {
      this.updateForm(eleve);
    });
  }

  updateForm(eleve: IEleve) {
    this.editForm.patchValue({
      id: eleve.id,
      photo: eleve.photo,
      photoContentType: eleve.photoContentType,
      nom: eleve.nom,
      prenom: eleve.prenom,
      adresse: eleve.adresse,
      email: eleve.email,
      mobile: eleve.mobile,
      dateNaissance: eleve.dateNaissance != null ? eleve.dateNaissance.format(DATE_TIME_FORMAT) : null,
      classe: eleve.classe
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        if (isImage && !/^image\//.test(file.type)) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      () => console.log('blob added'), // sucess
      this.onError
    );
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const eleve = this.createFromForm();
    if (eleve.id !== undefined) {
      this.subscribeToSaveResponse(this.eleveService.update(eleve));
    } else {
      this.subscribeToSaveResponse(this.eleveService.create(eleve));
    }
  }

  private createFromForm(): IEleve {
    return {
      ...new Eleve(),
      id: this.editForm.get(['id']).value,
      photoContentType: this.editForm.get(['photoContentType']).value,
      photo: this.editForm.get(['photo']).value,
      nom: this.editForm.get(['nom']).value,
      prenom: this.editForm.get(['prenom']).value,
      adresse: this.editForm.get(['adresse']).value,
      email: this.editForm.get(['email']).value,
      mobile: this.editForm.get(['mobile']).value,
      dateNaissance:
        this.editForm.get(['dateNaissance']).value != null
          ? moment(this.editForm.get(['dateNaissance']).value, DATE_TIME_FORMAT)
          : undefined,
      classe: this.editForm.get(['classe']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEleve>>) {
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
}
