import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHouseRequest } from './dto/create-house.dto';
import { House } from './house.entity';
import { UpdateHouseParams } from './house.interface';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House)
    private houseRepository: Repository<House>,
  ) {}

  create(dto: CreateHouseRequest): Promise<House> {
    const house = this.houseRepository.create(dto);
    return this.houseRepository.save(house);
  }

  async update({ ubid, dto, house }: UpdateHouseParams): Promise<House> {
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

  getByUbid(ubid: string): Promise<House> {
    return this.houseRepository.findOne({
      where: { ubid },
    });
  }
}
