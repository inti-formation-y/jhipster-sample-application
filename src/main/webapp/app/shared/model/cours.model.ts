import { Moment } from 'moment';
import { IVideo } from 'app/shared/model/video.model';
import { IEleve } from 'app/shared/model/eleve.model';

export interface ICours {
  id?: number;
  titre?: string;
  dateAjout?: Moment;
  videos?: IVideo[];
  eleve?: IEleve;
}

export class Cours implements ICours {
  constructor(public id?: number, public titre?: string, public dateAjout?: Moment, public videos?: IVideo[], public eleve?: IEleve) {}
}
