import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { Modalidade } from '@prisma/client';

export class CreateExameDto {
  @IsUUID()
  @IsNotEmpty()
  pacienteId: string;

  @IsEnum(Modalidade)
  @IsNotEmpty()
  modalidade: Modalidade;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsDateString()
  @IsNotEmpty()
  dataExame: string;

  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;
}
