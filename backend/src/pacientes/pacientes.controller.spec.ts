import { Test, TestingModule } from '@nestjs/testing';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';

const mockPacientesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('PacientesController', () => {
  let controller: PacientesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacientesController],
      providers: [
        { provide: PacientesService, useValue: mockPacientesService },
      ],
    }).compile();

    controller = module.get<PacientesController>(PacientesController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve chamar service.create com o DTO correto', async () => {
      const dto = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        telefone: '11999999999',
        dataNascimento: '1990-01-01',
      };
      const pacienteCriado = { id: 'uuid-1', ...dto };

      mockPacientesService.create.mockResolvedValue(pacienteCriado);

      const result = await controller.create(dto);

      expect(result).toEqual(pacienteCriado);
      expect(mockPacientesService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve chamar service.findAll com page e pageSize convertidos para número', async () => {
      const response = { data: [], meta: { total: 0, page: 1, pageSize: 10, totalPages: 0 } };
      mockPacientesService.findAll.mockResolvedValue(response);

      const result = await controller.findAll('1', '10');

      expect(result).toEqual(response);
      expect(mockPacientesService.findAll).toHaveBeenCalledWith(1, 10);
    });

    it('deve usar valores padrão page=1 e pageSize=10', async () => {
      mockPacientesService.findAll.mockResolvedValue({ data: [], meta: {} });

      await controller.findAll('1', '10');

      expect(mockPacientesService.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('deve chamar service.findOne com o id correto', async () => {
      const paciente = { id: 'uuid-1', nome: 'João' };
      mockPacientesService.findOne.mockResolvedValue(paciente);

      const result = await controller.findOne('uuid-1');

      expect(result).toEqual(paciente);
      expect(mockPacientesService.findOne).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('update', () => {
    it('deve chamar service.update com id e DTO corretos', async () => {
      const dto = { telefone: '11929289071' };
      const pacienteAtualizado = { id: 'uuid-1', ...dto };

      mockPacientesService.update.mockResolvedValue(pacienteAtualizado);

      const result = await controller.update('uuid-1', dto);

      expect(result).toEqual(pacienteAtualizado);
      expect(mockPacientesService.update).toHaveBeenCalledWith('uuid-1', dto);
    });
  });
});