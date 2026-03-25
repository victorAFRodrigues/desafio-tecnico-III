import { Module } from '@nestjs/common';
import { PacientesModule } from './pacientes/pacientes.module';
import { ExamesModule } from './exames/exames.module';
import { PrismaService } from './shared/prisma/prisma.service';

@Module({
  imports: [PacientesModule, ExamesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
