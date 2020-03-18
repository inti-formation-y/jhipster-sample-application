import { Moment } from 'moment';
import { ICours } from 'app/shared/model/cours.model';

export const enum Classe {
  CP = 'CP',
  CE1 = 'CE1',
  CE2 = 'CE2',
  CM1 = 'CM1',
  CM2 = 'CM2'
}

export interface IEleve {
  id?: number;
  photoContentType?: string;
  photo?: any;
  nom?: string;
  prenom?: string;
  adresse?: string;
  email?: string;
  mobile?: string;
  dateNaissance?: Moment;
  classe?: Classe;
  cours?: ICours[];
}

export class Eleve implements IEleve {
  constructor(
    public id?: number,
    public photoContentType?: string,
    public photo?: any,
    public nom?: string,
    public prenom?: string,
    public adresse?: string,
    public email?: string,
    public mobile?: string,
    public dateNaissance?: Moment,
    public classe?: Classe,
    public cours?: ICours[]
  ) {}
}
