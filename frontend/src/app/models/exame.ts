import { Paciente } from './paciente';

export type Modalidade = 'CR' | 'CT' | 'DX' | 'MG' | 'MR' | 'NM' | 'OT' | 'PT' | 'RF' | 'US' | 'XA';

export const MODALIDADES: Modalidade[] = ['CR', 'CT', 'DX', 'MG', 'MR', 'NM', 'OT', 'PT', 'RF', 'US', 'XA'];

export interface Exame {
  id: string;
  pacienteId: string;
  paciente?: Pick<Paciente, 'id' | 'nome' | 'cpf'>;
  modalidade: Modalidade;
  descricao: string;
  dataExame: string;
  idempotencyKey: string;
  createdAt: string;
}

export interface CreateExameDto {
  pacienteId: string;
  modalidade: Modalidade;
  descricao: string;
  dataExame: string;
  idempotencyKey: string;
}
