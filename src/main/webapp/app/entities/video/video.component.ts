import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVideo } from 'app/shared/model/video.model';
import { VideoService } from './video.service';
import { VideoDeleteDialogComponent } from './video-delete-dialog.component';

@Component({
  selector: 'jhi-video',
  templateUrl: './video.component.html'
})
export class VideoComponent implements OnInit, OnDestroy {
  videos?: IVideo[];
  eventSubscriber?: Subscription;

  constructor(
    protected videoService: VideoService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.videoService.query().subscribe((res: HttpResponse<IVideo[]>) => (this.videos = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInVideos();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IVideo): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType: string, base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInVideos(): void {
    this.eventSubscriber = this.eventManager.subscribe('videoListModification', () => this.loadAll());
  }

  delete(video: IVideo): void {
    const modalRef = this.modalService.open(VideoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.video = video;
  }
}
