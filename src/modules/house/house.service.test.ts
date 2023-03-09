import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { AuthGuard } from 'src/guards';
import { HouseHistory } from './entities/house-history.entity';
import { House } from './entities/house.entity';
import { HouseService } from './house.service';

const houseRepositoryMock = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
  manager: {
    transaction: jest.fn(),
  },
};
const houseHistoryRepositoryMock = {
  create: jest.fn(),
  save: jest.fn(),
};
const createHouseRequest = {
  name: 'Mocked',
  latitude: 10.762622,
  longitude: 106.660172,
};
const mockHouse = {
  id: randomUUID(),
  ubid: randomUUID(),
  ...createHouseRequest,
};

describe('HouseService', () => {
  let service: HouseService;

  beforeEach(async () => {
    jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HouseService,
        {
          provide: getRepositoryToken(House),
          useValue: houseRepositoryMock,
        },
        {
          provide: getRepositoryToken(HouseHistory),
          useValue: houseHistoryRepositoryMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    service = module.get<HouseService>(HouseService);
  });

  describe('create()', () => {
    describe('success', () => {
      it('should return a new house', async () => {
        houseRepositoryMock.create.mockReturnValue(mockHouse);
        houseRepositoryMock.save.mockResolvedValue(mockHouse);

        const createdMouse = await service.create(createHouseRequest);

        expect(houseRepositoryMock.create).toHaveBeenCalledWith(
          createHouseRequest,
        );
        expect(houseRepositoryMock.save).toHaveBeenCalledWith(mockHouse);
        expect(createdMouse).toEqual(mockHouse);
      });
    });
  });

  describe('update()', () => {
    const updateHouseRequest = {
      ubid: mockHouse.ubid,
      dto: {
        name: 'Mocked update',
      },
      house: mockHouse as House,
    };
    describe('success', () => {
      it('should return the updated house', async () => {
        const mockUpdateHouse = { ...mockHouse, ...updateHouseRequest.dto };

        houseRepositoryMock.save.mockResolvedValue(mockUpdateHouse);

        const updatedHouse = await service.update(updateHouseRequest);

        expect(houseRepositoryMock.findOne).not.toHaveBeenCalled();
        expect(houseRepositoryMock.save).toHaveBeenCalledWith(mockUpdateHouse);
        expect(updatedHouse).toEqual(mockUpdateHouse);
      });
    });

    describe('error', () => {
      it('should throw NotFoundException when house not found', async () => {
        houseRepositoryMock.findOne.mockResolvedValue(null);

        await expect(
          service.update({
            ubid: updateHouseRequest.ubid,
            dto: updateHouseRequest.dto,
          }),
        ).rejects.toThrowError(NotFoundException);
        expect(houseRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('updateOccupancy()', () => {
    const updateOccupancyRequest = {
      ubid: mockHouse.ubid,
      dto: {
        eggs: 5,
        birds: 2,
      },
      house: mockHouse as House,
    };
    describe('success', () => {
      it('should return the updated house', async () => {
        const mockUpdateHouse = { ...mockHouse, ...updateOccupancyRequest.dto };
        const mockHouseHistory = {
          ubid: mockHouse.ubid,
          ...updateOccupancyRequest.dto,
        };
        houseRepositoryMock.manager.transaction.mockResolvedValueOnce(
          mockUpdateHouse,
        );

        const updatedHouse = await service.updateOccupancy(
          updateOccupancyRequest,
        );

        expect(houseRepositoryMock.findOne).not.toHaveBeenCalled();
        expect(houseHistoryRepositoryMock.create).toHaveBeenCalledWith(
          mockHouseHistory,
        );
        expect(houseRepositoryMock.manager.transaction).toHaveBeenCalled();
        expect(updatedHouse).toEqual(mockUpdateHouse);
      });
    });

    describe('error', () => {
      it('should throw NotFoundException when house not found', async () => {
        houseRepositoryMock.findOne.mockResolvedValue(null);

        expect(
          service.updateOccupancy({
            ubid: updateOccupancyRequest.ubid,
            dto: updateOccupancyRequest.dto,
          }),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });
});
