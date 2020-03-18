/* tslint:disable max-line-length */
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { EleveService } from 'app/entities/eleve/eleve.service';
import { IEleve, Eleve, Classe } from 'app/shared/model/eleve.model';

describe('Service Tests', () => {
  describe('Eleve Service', () => {
    let injector: TestBed;
    let service: EleveService;
    let httpMock: HttpTestingController;
    let elemDefault: IEleve;
    let expectedResult;
    let currentDate: moment.Moment;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule]
      });
      expectedResult = {};
      injector = getTestBed();
      service = injector.get(EleveService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Eleve(0, 'image/png', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', 'AAAAAAA', currentDate, Classe.CP);
    });

    describe('Service methods', () => {
      it('should find an element', async () => {
        const returnedFromService = Object.assign(
          {
            dateNaissance: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        service
          .find(123)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: elemDefault });
      });

      it('should create a Eleve', async () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dateNaissance: currentDate.format(DATE_TIME_FORMAT)
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateNaissance: currentDate
          },
          returnedFromService
        );
        service
          .create(new Eleve(null))
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should update a Eleve', async () => {
        const returnedFromService = Object.assign(
          {
            photo: 'BBBBBB',
            nom: 'BBBBBB',
            prenom: 'BBBBBB',
            adresse: 'BBBBBB',
            email: 'BBBBBB',
            mobile: 'BBBBBB',
            dateNaissance: currentDate.format(DATE_TIME_FORMAT),
            classe: 'BBBBBB'
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dateNaissance: currentDate
          },
          returnedFromService
        );
        service
          .update(expected)
          .pipe(take(1))
          .subscribe(resp => (expectedResult = resp));
        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject({ body: expected });
      });

      it('should return a list of Eleve', async () => {
        const returnedFromService = Object.assign(
          {
            photo: 'BBBBBB',
            nom: 'BBBBBB',
            prenom: 'BBBBBB',
            adresse: 'BBBBBB',
            email: 'BBBBBB',
            mobile: 'BBBBBB',
            dateNaissance: currentDate.format(DATE_TIME_FORMAT),
            classe: 'BBBBBB'
          },
          elemDefault
        );
        const expected = Object.assign(
          {
            dateNaissance: currentDate
          },
          returnedFromService
        );
        service
          .query(expected)
          .pipe(
            take(1),
            map(resp => resp.body)
          )
          .subscribe(body => (expectedResult = body));
        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Eleve', async () => {
        const rxPromise = service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
