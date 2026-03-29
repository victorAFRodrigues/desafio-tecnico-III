import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  create(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.create(dto);
  }

  @Get()
  @HttpCode(200)
  findAll(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    console.log({ page, pageSize });

    return this.pacientesService.findAll(
      isNaN(parsedPage) ? 1 : parsedPage,
      isNaN(parsedPageSize) ? 10 : parsedPageSize,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePacienteDto) {
    return this.pacientesService.update(id, dto);
  }
}
