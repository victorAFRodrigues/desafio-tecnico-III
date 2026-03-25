import { Test, TestingModule } from '@nestjs/testing';
import { ExamesController } from './exames.controller';
import { ExamesService } from './exames.service';
import { Modalidade } from '@prisma/client';

const mockExamesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

const makeDto = (overrides = {}) => ({
  pacienteId: 'paciente-uuid-1',
  modalidade: Modalidade.CR,
  descricao: 'Radiografia de tórax',
  dataExame: '2024-03-25T14:30:00.000Z',
  idempotencyKey: 'chave-unica-123',
  ...overrides,
});

describe('ExamesController', () => {
  let controller: ExamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamesController],
      providers: [
        { provide: ExamesService, useValue: mockExamesService },
      ],
    }).compile();

    controller = module.get<ExamesController>(ExamesController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve chamar service.create e retornar statusCode 201 para exame novo', async () => {
      const dto = makeDto();
      const response = { statusCode: 201, data: { id: 'exame-uuid-1', ...dto } };

      mockExamesService.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(result).toEqual(response);
      expect(mockExamesService.create).toHaveBeenCalledWith(dto);
    });

    it('deve retornar statusCode 200 para idempotencyKey já existente', async () => {
      const dto = makeDto();
      const response = { statusCode: 200, data: { id: 'exame-uuid-1', ...dto } };

      mockExamesService.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(result.statusCode).toBe(200);
    });
  });

  describe('findAll', () => {
    it('deve chamar service.findAll com page e pageSize convertidos para número', async () => {
      const response = {
        data: [],
        meta: { total: 0, page: 1, pageSize: 10, totalPages: 0 },
      };
      mockExamesService.findAll.mockResolvedValue(response);

      const result = await controller.findAll('1', '10');

      expect(result).toEqual(response);
      expect(mockExamesService.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('deve chamar service.findOne com o id correto', async () => {
      const exame = { id: 'exame-uuid-1', modalidade: Modalidade.CR };
      mockExamesService.findOne.mockResolvedValue(exame);

      const result = await controller.findOne('exame-uuid-1');

      expect(result).toEqual(exame);
      expect(mockExamesService.findOne).toHaveBeenCalledWith('exame-uuid-1');
    });
  });
});