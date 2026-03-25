import { IsDateString, IsString } from 'class-validator';

export class CreatePacienteDto {
  @IsString()
  nome: string;

  @IsString()
  documento: string;

  @IsDateString()
  dataNascimento: string;
}
