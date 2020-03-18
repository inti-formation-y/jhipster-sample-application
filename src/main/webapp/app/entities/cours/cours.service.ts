import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICours } from 'app/shared/model/cours.model';

type EntityResponseType = HttpResponse<ICours>;
type EntityArrayResponseType = HttpResponse<ICours[]>;

@Injectable({ providedIn: 'root' })
export class CoursService {
  public resourceUrl = SERVER_API_URL + 'api/cours';

  constructor(protected http: HttpClient) {}

  create(cours: ICours): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cours);
    return this.http
      .post<ICours>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(cours: ICours): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cours);
    return this.http
      .put<ICours>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICours>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICours[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(cours: ICours): ICours {
    const copy: ICours = Object.assign({}, cours, {
      dateAjout: cours.dateAjout != null && cours.dateAjout.isValid() ? cours.dateAjout.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateAjout = res.body.dateAjout != null ? moment(res.body.dateAjout) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((cours: ICours) => {
        cours.dateAjout = cours.dateAjout != null ? moment(cours.dateAjout) : null;
      });
    }
    return res;
  }
}
