import { Injectable } from '@nestjs/common';
import { CreateExameDto } from './dto/create-exame.dto';
import { UpdateExameDto } from './dto/update-exame.dto';

@Injectable()
export class ExamesService {
  create(createExameDto: CreateExameDto) {
    return 'This action adds a new exame';
  }

  findAll() {
    return `This action returns all exames`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exame`;
  }

  update(id: number, updateExameDto: UpdateExameDto) {
    return `This action updates a #${id} exame`;
  }

  remove(id: number) {
    return `This action removes a #${id} exame`;
  }
}
