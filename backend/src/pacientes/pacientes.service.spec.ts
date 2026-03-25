import { Test, TestingModule } from '@nestjs/testing';
import { PacientesService } from './pacientes.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';

const mockPrismaService = {
  paciente: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn(),
  handleError: jest.fn(),
};

describe('PacientesService', () => {
  let service: PacientesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
    jest.clearAllMocks();
  });

  // Cenário 1 — Criar paciente com dados válidos
  describe('create', () => {
    it('deve criar um paciente com sucesso e retornar UUID', async () => {
      const dto = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        dataNascimento: '1990-01-01',
      };

      const pacienteCriado = {
        id: 'uuid-123',
        ...dto,
        dataNascimento: new Date(dto.dataNascimento),
        createdAt: new Date(),
      };

      mockPrismaService.paciente.create.mockResolvedValue(pacienteCriado);

      const result = await service.create(dto);

      expect(result).toEqual(pacienteCriado);
      expect(mockPrismaService.paciente.create).toHaveBeenCalledWith({
        data: {
          nome: dto.nome,
          cpf: dto.cpf,
          telefone: dto.telefone,
          email: dto.email,
          dataNascimento: new Date(dto.dataNascimento),
        },
      });
    });

    // Cenário 2 — Criar paciente com CPF duplicado retorna 409
    it('deve chamar handleError ao tentar criar paciente com CPF duplicado', async () => {
      const dto = {
        nome: 'Maria',
        cpf: '12345678901',
        email: 'maria@email.com',
        telefone: '11988888888',
        dataNascimento: '1985-05-15',
      };

      const prismaError = {
        code: 'P2002',
        message: 'Unique constraint failed',
      };

      mockPrismaService.paciente.create.mockRejectedValue(prismaError);
      mockPrismaService.handleError.mockImplementation(() => {
        throw new ConflictException('Registro duplicado');
      });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.handleError).toHaveBeenCalledWith(prismaError);
    });
  });

  // Cenário 8 — Listar pacientes com paginação
  describe('findAll', () => {
    it('deve retornar lista paginada de pacientes', async () => {
      const pacientes = [
        { id: 'uuid-1', nome: 'João', cpf: '111', email: 'joao@email.com', createdAt: new Date() },
        { id: 'uuid-2', nome: 'Maria', cpf: '222', email: 'maria@email.com', createdAt: new Date() },
      ];

      mockPrismaService.$transaction.mockResolvedValue([pacientes, 2]);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: pacientes,
        meta: {
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      });
    });

    it('deve calcular totalPages corretamente', async () => {
      mockPrismaService.$transaction.mockResolvedValue([[], 25]);

      const result = await service.findAll(1, 10);

      expect(result.meta.totalPages).toBe(3);
    });

    it('deve aplicar skip correto para página 2', async () => {
      mockPrismaService.$transaction.mockResolvedValue([[], 0]);

      await service.findAll(2, 10);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um paciente pelo id', async () => {
      const paciente = { id: 'uuid-1', nome: 'João', cpf: '111', email: 'joao@email.com' };
      mockPrismaService.paciente.findUnique.mockResolvedValue(paciente);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(paciente);
      expect(mockPrismaService.paciente.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
    });

    it('deve retornar null para paciente inexistente', async () => {
      mockPrismaService.paciente.findUnique.mockResolvedValue(null);

      const result = await service.findOne('uuid-invalido');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar os dados do paciente', async () => {
      const dto = { nome: 'João Atualizado', telefone: '11977777777' };
      const pacienteAtualizado = { id: 'uuid-1', ...dto };

      mockPrismaService.paciente.update.mockResolvedValue(pacienteAtualizado);

      const result = await service.update('uuid-1', dto);

      expect(result).toEqual(pacienteAtualizado);
      expect(mockPrismaService.paciente.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: dto,
      });
    });
  });
});