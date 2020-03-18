import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IEleve } from 'app/shared/model/eleve.model';

type EntityResponseType = HttpResponse<IEleve>;
type EntityArrayResponseType = HttpResponse<IEleve[]>;

@Injectable({ providedIn: 'root' })
export class EleveService {
  public resourceUrl = SERVER_API_URL + 'api/eleves';

  constructor(protected http: HttpClient) {}

  create(eleve: IEleve): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eleve);
    return this.http
      .post<IEleve>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(eleve: IEleve): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(eleve);
    return this.http
      .put<IEleve>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IEleve>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEleve[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(eleve: IEleve): IEleve {
    const copy: IEleve = Object.assign({}, eleve, {
      dateNaissance: eleve.dateNaissance != null && eleve.dateNaissance.isValid() ? eleve.dateNaissance.toJSON() : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateNaissance = res.body.dateNaissance != null ? moment(res.body.dateNaissance) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((eleve: IEleve) => {
        eleve.dateNaissance = eleve.dateNaissance != null ? moment(eleve.dateNaissance) : null;
      });
    }
    return res;
  }
}
