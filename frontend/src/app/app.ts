import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MenubarModule],
  templateUrl: './app.html',
})
export class App {
  items: MenuItem[] = [
    {
      label: 'Pacientes',
      icon: 'pi pi-users',
      routerLink: '/pacientes',
    },
    {
      label: 'Exames',
      icon: 'pi pi-file-medical',
      routerLink: '/exames',
    },
  ];
}
