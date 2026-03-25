import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePacienteDto {
    @ApiPropertyOptional({ example: '11999999999' })
    @IsString()
    @IsOptional()
    telefone?: string;

    @ApiPropertyOptional({ example: 'joao@email.com' })
    @IsEmail()
    @IsOptional()
    email?: string;
}