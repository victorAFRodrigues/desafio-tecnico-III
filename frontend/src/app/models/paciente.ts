import { Exame } from './exame';

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  telefone?: string;
  email: string;
  dataNascimento: string;
  createdAt: string;
  exames?: Exame[];
}

export interface CreatePacienteDto {
  nome: string;
  cpf: string;
  telefone?: string;
  email: string;
  dataNascimento: string;
}

