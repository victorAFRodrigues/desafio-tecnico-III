import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { HttpErrorResponse } from '@angular/common/http';
import { ExameService } from '../../../services/exame';
import { PacienteService } from '../../../services/paciente';
import { MODALIDADES, Modalidade } from '../../../models/exame';
import { Paciente } from '../../../models/paciente';
import { Tooltip } from 'primeng/tooltip';
@Component({
  selector: 'app-form-exames',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    TextareaModule,
    Tooltip,
  ],
  templateUrl: './form-exames.html',
  styleUrl: './form-exames.scss',
})
export class FormExames implements OnInit {
  private fb = inject(FormBuilder);
  private exameService = inject(ExameService);
  private pacienteService = inject(PacienteService);

  @Output() created = new EventEmitter<void>();
  @Output() formError = new EventEmitter<string>();

  submitting = false;
  pacientes: Paciente[] = [];
  modalidades: Modalidade[] = MODALIDADES;
  today = new Date();

  form = this.fb.group({
    pacienteId: ['', Validators.required],
    modalidade: ['', Validators.required],
    descricao: ['', Validators.required],
    dataExame: [null, Validators.required],
    idempotencyKey: [this.generateKey()],
  });

  ngOnInit() {
    this.pacienteService.getAll(1, 100).subscribe({
      next: (res) => (this.pacientes = res.data),
    });
  }

  generateKey(): string {
    return crypto.randomUUID();
  }

  regenerateKey() {
    this.form.patchValue({ idempotencyKey: this.generateKey() });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const value = this.form.value;

    this.exameService
      .create({
        pacienteId: value.pacienteId!,
        modalidade: value.modalidade as Modalidade,
        descricao: value.descricao!,
        dataExame: (value.dataExame as unknown as Date).toISOString(),
        idempotencyKey: value.idempotencyKey!,
      })
      .subscribe({
        next: (res) => {
          this.submitting = false;
          this.form.reset();
          this.form.patchValue({ idempotencyKey: this.generateKey() });

          // 200 = idempotente (já existia), 201 = criado
          const detail =
            res.statusCode === 200
              ? 'Exame já existia — retornado sem duplicar.'
              : 'Exame cadastrado com sucesso!';

          this.created.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.submitting = false;
          const msg = err.status === 400 ? 'Paciente não encontrado.' : 'Erro ao cadastrar exame.';
          this.formError.emit(msg);
        },
      });
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }
}
