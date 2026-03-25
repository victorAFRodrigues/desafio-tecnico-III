import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';

@Controller('exames')
export class ExamesController {
  constructor(private readonly examesService: ExamesService) {}

  @Post()
  create(@Body() createExameDto: CreateExameDto) {
    return this.examesService.create(createExameDto);
  }

  @Get()
  findAll() {
    return this.examesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExameDto: UpdateExameDto) {
    return this.examesService.update(+id, updateExameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.examesService.remove(+id);
  }
}
