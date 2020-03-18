import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEleve } from 'app/shared/model/eleve.model';
import { EleveService } from './eleve.service';

@Component({
  selector: 'jhi-eleve-delete-dialog',
  templateUrl: './eleve-delete-dialog.component.html'
})
export class EleveDeleteDialogComponent {
  eleve: IEleve;

  constructor(protected eleveService: EleveService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.eleveService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'eleveListModification',
        content: 'Deleted an eleve'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-eleve-delete-popup',
  template: ''
})
export class EleveDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ eleve }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(EleveDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.eleve = eleve;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/eleve', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/eleve', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
