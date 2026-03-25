import { Injectable } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePacienteDto) {
    try {
      return await this.prisma.paciente.create({
        data: {
          nome: dto.nome,
          documento: dto.documento,
          dataNascimento: new Date(dto.dataNascimento),
        },
      });
    } catch (error) {
      this.prisma.handleError(error);
    }
  }

  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.paciente.findMany({
          skip,
          take: pageSize,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.paciente.count(),
      ]);

      return {
        data,
        meta: {
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    } catch (error) {
      this.prisma.handleError(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.prisma.paciente.findUnique({
        where: { id },
      });
    } catch (error) {
      this.prisma.handleError(error);
    }
  }

  async update(id: string, dto: UpdatePacienteDto) {
    try {
      return await this.prisma.paciente.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.prisma.handleError(error);
    }
  }
}
