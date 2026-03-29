import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ExameService } from '../../../services/exame';
import { Exame } from '../../../models/exame';
import { FormExames } from '../form-exames/form-exames';

@Component({
  selector: 'app-lista-exames',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ProgressSpinnerModule,
    FormExames,
  ],
  providers: [MessageService],
  templateUrl: './lista-exames.html',
  styleUrl: './lista-exames.scss',
})
export class ListaExames implements OnInit {
  private exameService = inject(ExameService);
  private messageService = inject(MessageService);

  exames = signal<Exame[]>([]);
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

    this.exameService.getAll(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.exames.set(res.data);
        this.total = res.meta.total;
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: any) {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.load();
  }

  openForm() {
    this.dialogVisible.set(true);
  }

  onExamCreated() {
    this.dialogVisible.set(false);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Exame cadastrado!',
    });
    this.load();
  }

  onFormError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
  }
}
