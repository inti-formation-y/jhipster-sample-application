/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { JhEmployeeTestModule } from '../../../test.module';
import { EleveDeleteDialogComponent } from 'app/entities/eleve/eleve-delete-dialog.component';
import { EleveService } from 'app/entities/eleve/eleve.service';

describe('Component Tests', () => {
  describe('Eleve Management Delete Component', () => {
    let comp: EleveDeleteDialogComponent;
    let fixture: ComponentFixture<EleveDeleteDialogComponent>;
    let service: EleveService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhEmployeeTestModule],
        declarations: [EleveDeleteDialogComponent]
      })
        .overrideTemplate(EleveDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EleveDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(EleveService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
