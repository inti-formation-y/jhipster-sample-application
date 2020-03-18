/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JhEmployeeTestModule } from '../../../test.module';
import { EleveDetailComponent } from 'app/entities/eleve/eleve-detail.component';
import { Eleve } from 'app/shared/model/eleve.model';

describe('Component Tests', () => {
  describe('Eleve Management Detail Component', () => {
    let comp: EleveDetailComponent;
    let fixture: ComponentFixture<EleveDetailComponent>;
    const route = ({ data: of({ eleve: new Eleve(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [JhEmployeeTestModule],
        declarations: [EleveDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(EleveDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EleveDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.eleve).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
