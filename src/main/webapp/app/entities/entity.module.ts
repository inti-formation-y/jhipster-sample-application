import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'cours',
        loadChildren: './cours/cours.module#JhEmployeeCoursModule'
      },
      {
        path: 'video',
        loadChildren: './video/video.module#JhEmployeeVideoModule'
      },
      {
        path: 'eleve',
        loadChildren: './eleve/eleve.module#JhEmployeeEleveModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ]
})
export class JhEmployeeEntityModule {}
