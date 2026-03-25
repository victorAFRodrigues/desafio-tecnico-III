import { Test, TestingModule } from '@nestjs/testing';
import { ExamesService } from './exames.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Modalidade, Prisma } from '@prisma/client';

const mockPrismaService = {
  exame: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  paciente: {
    findUnique: jest.fn(),
  },
  $transaction: jest.fn(),
  handleError: jest.fn(),
};

const makeDto = (overrides = {}) => ({
  pacienteId: 'paciente-uuid-1',
  modalidade: Modalidade.CR,
  descricao: 'Radiografia de tórax',
  dataExame: '2024-03-25T14:30:00.000Z',
  idempotencyKey: 'chave-unica-123',
  ...overrides,
});

describe('ExamesService', () => {
  let service: ExamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ExamesService>(ExamesService);
    jest.clearAllMocks();
  });

  // Cenário 3 — Criar exame com paciente existente e idempotencyKey nova
  describe('create', () => {
    it('deve criar exame com sucesso retornando statusCode 201', async () => {
      const dto = makeDto();
      const exameCriado = { id: 'exame-uuid-1', ...dto, dataExame: new Date(dto.dataExame) };

      mockPrismaService.exame.findUnique.mockResolvedValue(null);
      mockPrismaService.paciente.findUnique.mockResolvedValue({ id: dto.pacienteId });
      mockPrismaService.$transaction.mockImplementation(async (fn) => fn({
        exame: { create: jest.fn().mockResolvedValue(exameCriado) },
      }));

      const result = await service.create(dto);

      expect(result).toEqual({ statusCode: 201, data: exameCriado });
    });

    // Cenário 4 — Reenviar exame com mesma idempotencyKey retorna 200
    it('deve retornar exame existente com statusCode 200 quando idempotencyKey já existe', async () => {
      const dto = makeDto();
      const exameExistente = { id: 'exame-uuid-1', ...dto };

      mockPrismaService.exame.findUnique.mockResolvedValue(exameExistente);

      const result = await service.create(dto);

      expect(result).toEqual({ statusCode: 200, data: exameExistente });
      expect(mockPrismaService.paciente.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
    });

    // Cenário 5 — Requisições simultâneas com mesma idempotencyKey — apenas um exame persistido
    it('deve tratar erro P2002 de concorrência e retornar exame já criado com statusCode 200', async () => {
      const dto = makeDto();
      const exameExistente = { id: 'exame-uuid-1', ...dto };

      mockPrismaService.exame.findUnique
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(exameExistente);

      mockPrismaService.paciente.findUnique.mockResolvedValue({ id: dto.pacienteId });

      const prismaError = new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed',
          { code: 'P2002', clientVersion: '5.x' }
      );

      mockPrismaService.$transaction.mockRejectedValue(prismaError);

      const result = await service.create(dto);

      expect(result).toEqual({ statusCode: 200, data: exameExistente });
    });

    // Cenário 6 — Criar exame com paciente inexistente retorna 400
    it('deve lançar BadRequestException quando paciente não existe', async () => {
      const dto = makeDto({ pacienteId: 'paciente-inexistente' });

      // Forçamos o null para garantir que ele passe pelo primeiro IF de idempotência
      mockPrismaService.exame.findUnique.mockResolvedValue(null);
      mockPrismaService.paciente.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    // Cenário 11 — Modalidade inválida (validada no DTO, mas garantimos que service recebe enum correto)
    it('deve criar exame com modalidade válida do enum', async () => {
      const dto = makeDto({ modalidade: Modalidade.MR });
      const exameCriado = { id: 'exame-uuid-2', ...dto };

      mockPrismaService.exame.findUnique.mockResolvedValue(null);
      mockPrismaService.paciente.findUnique.mockResolvedValue({ id: dto.pacienteId });
      mockPrismaService.$transaction.mockImplementation(async (fn) => fn({
        exame: { create: jest.fn().mockResolvedValue(exameCriado) },
      }));

      const result = await service.create(dto);

      expect(result.statusCode).toBe(201);
      expect(result.data).toEqual(exameCriado);
    });
  });

  // Cenário 7 — Listar exames com paginação
  describe('findAll', () => {
    it('deve retornar lista paginada de exames', async () => {
      const exames = [
        { id: 'exame-1', modalidade: Modalidade.CR, paciente: { id: 'p1', nome: 'João', cpf: '111' } },
        { id: 'exame-2', modalidade: Modalidade.CT, paciente: { id: 'p2', nome: 'Maria', cpf: '222' } },
      ];

      mockPrismaService.$transaction.mockResolvedValue([exames, 2]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: exames,
        meta: {
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      });
    });

    it('deve calcular totalPages corretamente com 25 registros e pageSize 10', async () => {
      mockPrismaService.$transaction.mockResolvedValue([[], 25]);

      const result = await service.findAll(1, 10);

      expect(result.meta.totalPages).toBe(3);
    });
  });

  describe('findOne', () => {
    it('deve retornar exame pelo id', async () => {
      const exame = { id: 'exame-uuid-1', modalidade: Modalidade.CR };
      mockPrismaService.exame.findUnique.mockResolvedValue(exame);

      const result = await service.findOne('exame-uuid-1');

      expect(result).toEqual(exame);
      expect(mockPrismaService.exame.findUnique).toHaveBeenCalledWith({
        where: { id: 'exame-uuid-1' },
      });
    });

    it('deve retornar null para exame inexistente', async () => {
      mockPrismaService.exame.findUnique.mockResolvedValue(null);

      const result = await service.findOne('uuid-invalido');

      expect(result).toBeNull();
    });
  });
});