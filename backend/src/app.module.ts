import { Module } from '@nestjs/common';
import { PacientesModule } from './pacientes/pacientes.module';
import { ExamesModule } from './exames/exames.module';
import { PrismaService } from './shared/prisma/prisma.service';
import { AppController } from './app.controller';

@Module({
  imports: [PacientesModule, ExamesModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
