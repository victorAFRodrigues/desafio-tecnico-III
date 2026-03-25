import { IsDateString, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreatePacienteDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  nome: string;

  @ApiProperty({ example: '997.907.550-31' })
  @IsString()
  cpf: string;

  @ApiProperty({ example: '(92) 99801-5518' })
  @IsString()
  telefone: string;

  @ApiProperty({ example: 'johndoe96@capgemini.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '10/02/2003' })
  @IsDateString()
  dataNascimento: string;
}
