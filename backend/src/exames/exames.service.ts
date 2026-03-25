import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateExameDto } from './dto/create-exame.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExamesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExameDto) {
    // idempotência — retorna o existente se a key já foi usada
    const existing = await this.prisma.exame.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
    });

    if (existing) return { statusCode: 200, data: existing };

    // valida se paciente existe
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: dto.pacienteId },
    });

    if (!paciente) throw new BadRequestException('Paciente não encontrado');

    // transação para garantir atomicidade em requisições concorrentes
    try {
      const exame = await this.prisma.$transaction(async (tx) => {
        return tx.exame.create({
          data: {
            pacienteId: dto.pacienteId,
            modalidade: dto.modalidade,
            descricao: dto.descricao,
            dataExame: new Date(dto.dataExame),
            idempotencyKey: dto.idempotencyKey,
          },
        });
      });

      return { statusCode: 201, data: exame };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const exame = await this.prisma.exame.findUnique({
          where: { idempotencyKey: dto.idempotencyKey },
        });
        return { statusCode: 200, data: exame };
      }
      this.prisma.handleError(error);
    }
  }

  async findAll(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.exame.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          paciente: { select: { id: true, nome: true, documento: true } },
        },
      }),
      this.prisma.exame.count(),
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
  }

  async findOne(id: string) {
    return this.prisma.exame.findUnique({
      where: { id },
    });
  }
}
