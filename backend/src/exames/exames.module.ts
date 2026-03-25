import { Module } from '@nestjs/common';
import { ExamesService } from './exames.service';
import { ExamesController } from './exames.controller';

@Module({
  controllers: [ExamesController],
  providers: [ExamesService],
})
export class ExamesModule {}
