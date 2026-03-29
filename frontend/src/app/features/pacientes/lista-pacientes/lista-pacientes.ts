import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { PacienteService } from '../../../services/paciente';
import { Paciente } from '../../../models/paciente';
import { FormPacientes } from '../form-pacientes/form-pacientes';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ProgressSpinnerModule,
    FormPacientes,
  ],
  providers: [MessageService],
  templateUrl: './lista-pacientes.html',
  styleUrl: './lista-pacientes.scss',
})
export class ListaPacientes implements OnInit {
  private pacienteService = inject(PacienteService);
  private messageService = inject(MessageService);

  pacientes = signal<Paciente[]>([]);
  loading = signal(false);
  error = signal(false);
  dialogVisible = signal(false);

  page = 1;
  pageSize = 10;
  total = 0;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set(false);

    this.pacienteService.getAll(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.pacientes.set(res.data);
        this.total = res.meta.total;
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  first = 0;

  onPageChange(event: any) {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.first = event.first;
    this.load();
  }

  openForm() {
    this.dialogVisible.set(true);
  }

  onPacienteCreated() {
    this.dialogVisible.set(false);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Paciente cadastrado!',
    });
    this.load();
  }

  onFormError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}
