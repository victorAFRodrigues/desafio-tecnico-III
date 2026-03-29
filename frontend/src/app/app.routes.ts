import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pacientes', pathMatch: 'full' },
  {
    path: 'pacientes',
    loadComponent: () =>
      import('./features/pacientes/lista-pacientes/lista-pacientes').then(
        (m) => m.ListaPacientes,
      ),
  },
  {
    path: 'exames',
    loadComponent: () =>
      import('./features/exames/lista-exames/lista-exames').then((m) => m.ListaExames),
  },
];
