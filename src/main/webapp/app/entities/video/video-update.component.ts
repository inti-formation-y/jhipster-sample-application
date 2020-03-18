import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IVideo, Video } from 'app/shared/model/video.model';
import { VideoService } from './video.service';
import { ICours } from 'app/shared/model/cours.model';
import { CoursService } from 'app/entities/cours';

@Component({
  selector: 'jhi-video-update',
  templateUrl: './video-update.component.html'
})
export class VideoUpdateComponent implements OnInit {
  isSaving: boolean;

  cours: ICours[];

  editForm = this.fb.group({
    id: [],
    titre: [],
    contenu: [],
    contenuContentType: [],
    video: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected videoService: VideoService,
    protected coursService: CoursService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ video }) => {
      this.updateForm(video);
    });
    this.coursService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ICours[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICours[]>) => response.body)
      )
      .subscribe((res: ICours[]) => (this.cours = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(video: IVideo) {
    this.editForm.patchValue({
      id: video.id,
      titre: video.titre,
      contenu: video.contenu,
      contenuContentType: video.contenuContentType,
      video: video.video
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

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const video = this.createFromForm();
    if (video.id !== undefined) {
      this.subscribeToSaveResponse(this.videoService.update(video));
    } else {
      this.subscribeToSaveResponse(this.videoService.create(video));
    }
  }

  private createFromForm(): IVideo {
    return {
      ...new Video(),
      id: this.editForm.get(['id']).value,
      titre: this.editForm.get(['titre']).value,
      contenuContentType: this.editForm.get(['contenuContentType']).value,
      contenu: this.editForm.get(['contenu']).value,
      video: this.editForm.get(['video']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVideo>>) {
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

  trackCoursById(index: number, item: ICours) {
    return item.id;
  }
}
