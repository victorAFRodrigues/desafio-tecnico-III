import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ExamesService } from './exames.service';
import { CreateExameDto } from './dto/create-exame.dto';

@Controller('exames')
export class ExamesController {
  constructor(private readonly examesService: ExamesService) {}

  @Post()
  async create(@Body() dto: CreateExameDto) {
    return await this.examesService.create(dto);
  }

  @Get()
  @HttpCode(200)
  findAll(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    return this.examesService.findAll(Number(page), Number(pageSize));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examesService.findOne(id);
  }
}
