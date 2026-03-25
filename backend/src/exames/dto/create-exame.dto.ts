import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { Modalidade } from '@prisma/client';
import { ApiProperty } from "@nestjs/swagger";

export class CreateExameDto {
  @ApiProperty({
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    description: 'ID do paciente',
  })
  @IsUUID()
  @IsNotEmpty()
  pacienteId: string;

  @ApiProperty({
    example: Modalidade.CR,
    enum: Modalidade,
    description: 'Modalidade do exame',
  })
  @IsEnum(Modalidade)
  @IsNotEmpty()
  modalidade: Modalidade;

  @ApiProperty({
    example: 'Radiografia de tórax para avaliação pulmonar',
    description: 'Descrição do exame',
  })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({
    example: '2024-03-25T14:30:00.000Z',
    description: 'Data de realização do exame',
  })
  @IsDateString()
  @IsNotEmpty()
  dataExame: string;

  @ApiProperty({
    example: 'a3bb189e-8bf9-3888-9912-ace4e6543002',
    description: 'Chave de idempotência para evitar duplicatas',
  })
  @IsString()
  @IsNotEmpty()
  idempotencyKey: string;
}