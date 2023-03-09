import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHouseRequest } from './dto/create-house.dto';
import { HouseHistory } from './entities/house-history.entity';
import { House } from './entities/house.entity';
import { UpdateHouseParams, UpdateOccupancyParams } from './house.interface';

@Injectable()
export class HouseService {
  private logger = new Logger(HouseService.name);
  constructor(
    @InjectRepository(House)
    private houseRepository: Repository<House>,

    @InjectRepository(HouseHistory)
    private houseHistoryRepository: Repository<HouseHistory>,
  ) {}

  create(dto: CreateHouseRequest): Promise<House> {
    this.logger.log(`create() with params ${JSON.stringify(dto)}`);
    const house = this.houseRepository.create(dto);
    return this.houseRepository.save(house);
  }

  async update({ ubid, dto, house }: UpdateHouseParams): Promise<House> {
    this.logger.log(
      `update() with params ${JSON.stringify({ ubid, dto, house })}`,
    );
    // We can pass the house object here to prevent making multiple queries,
    // only when no object is passed, we query the database
    if (!house) {
      house = await this.getByUbid(ubid);
    }
    if (!house) {
      throw new NotFoundException();
    }
    house = { ...house, ...dto };
    return this.houseRepository.save(house);
  }

  async updateOccupancy({
    ubid,
    dto,
    house,
  }: UpdateOccupancyParams): Promise<House> {
    this.logger.log(
      `updateOccupancy() with params ${JSON.stringify({ ubid, dto, house })}`,
    );
    if (!house) {
      house = await this.getByUbid(ubid);
    }
    house = this.houseRepository.create({ ...house, ...dto });
    const houseHistory = this.houseHistoryRepository.create({ ...dto, ubid });
    const manager = this.houseRepository.manager;
    // Update house record and add a new history record using transaction
    return manager
      .transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.save(houseHistory);
        await transactionalEntityManager.save(house);
      })
      .then(() => house)
      .catch((err) => {
        this.logger.error(
          `updateOccupancy() for house ${JSON.stringify(
            house,
          )} transaction failed: ',
          ${err.message},
        `,
        );
        throw new InternalServerErrorException('Something went wrong');
      });
  }

  getByUbid(ubid: string): Promise<House> {
    this.logger.log(`getByUbid() with params ${JSON.stringify({ ubid })}`);
    return this.houseRepository.findOne({
      where: { ubid },
    });
  }
}
