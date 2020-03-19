import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { JhiDataUtils, JhiFileLoadError, JhiEventManager, JhiEventWithContent } from 'ng-jhipster';

import { IVideo, Video } from 'app/shared/model/video.model';
import { VideoService } from './video.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { ICours } from 'app/shared/model/cours.model';
import { CoursService } from 'app/entities/cours/cours.service';

@Component({
  selector: 'jhi-video-update',
  templateUrl: './video-update.component.html'
})
export class VideoUpdateComponent implements OnInit {
  isSaving = false;
  cours: ICours[] = [];

  editForm = this.fb.group({
    id: [],
    titre: [],
    contenu: [],
    contenuContentType: [],
    video: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected videoService: VideoService,
    protected coursService: CoursService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ video }) => {
      this.updateForm(video);

      this.coursService.query().subscribe((res: HttpResponse<ICours[]>) => (this.cours = res.body || []));
    });
  }

  updateForm(video: IVideo): void {
    this.editForm.patchValue({
      id: video.id,
      titre: video.titre,
      contenu: video.contenu,
      contenuContentType: video.contenuContentType,
      video: video.video
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    this.dataUtils.openFile(contentType, base64String);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe(null, (err: JhiFileLoadError) => {
      this.eventManager.broadcast(
        new JhiEventWithContent<AlertError>('jhEmployeeApp.error', { ...err, key: 'error.file.' + err.key })
      );
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
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
      id: this.editForm.get(['id'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      contenuContentType: this.editForm.get(['contenuContentType'])!.value,
      contenu: this.editForm.get(['contenu'])!.value,
      video: this.editForm.get(['video'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVideo>>): void {
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

  trackById(index: number, item: ICours): any {
    return item.id;
  }
}
