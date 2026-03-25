import { Module } from '@nestjs/common';
import { ExamesService } from './exames.service';
import { ExamesController } from './exames.controller';
import { PrismaService } from '../shared/prisma/prisma.service';

@Module({
  controllers: [ExamesController],
  providers: [ExamesService, PrismaService],
})
export class ExamesModule {}
