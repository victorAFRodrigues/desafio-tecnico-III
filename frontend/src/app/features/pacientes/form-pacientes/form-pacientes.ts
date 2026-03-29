import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { PacienteService } from '../../../services/paciente';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, DatePickerModule],
  templateUrl: './form-pacientes.html',
  styleUrl: './form-pacientes.scss',
})
export class FormPacientes {
  private fb = inject(FormBuilder);
  private pacienteService = inject(PacienteService);
  protected today: Date | undefined | null;

  @Output() created = new EventEmitter<void>();
  @Output() formError = new EventEmitter<string>();

  submitting = false;

  form = this.fb.group({
    nome: ['', Validators.required],
    cpf: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    dataNascimento: [null, Validators.required],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const value = this.form.value;

    this.pacienteService
      .create({
        nome: value.nome!,
        cpf: value.cpf!,
        email: value.email!,
        telefone: value.telefone ?? undefined,
        dataNascimento: (value.dataNascimento as unknown as Date).toISOString(),
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.form.reset();
          this.created.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.submitting = false;
          const msg =
            err.status === 409 ? 'CPF ou email já cadastrado.' : 'Erro ao cadastrar paciente.';
          this.formError.emit(msg);
        },
      });
  }

  isInvalid(field: string) {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }
}
