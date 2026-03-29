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
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string
  ) {
    const parsedPage = Number(page);
    const parsedPageSize = Number(pageSize);

    console.log({ page, pageSize });

    return this.examesService.findAll(
      isNaN(parsedPage) ? 1 : parsedPage,
      isNaN(parsedPageSize) ? 10 : parsedPageSize,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examesService.findOne(id);
  }
}
