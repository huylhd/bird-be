import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHouseRequest } from './dto/create-house.dto';
import { House } from './house.entity';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House)
    private houseRepository: Repository<House>,
  ) {}

  create(dto: CreateHouseRequest) {
    const house = this.houseRepository.create(dto);
    return this.houseRepository.save(house);
  }

  getByUbid(ubid: string) {
    return this.houseRepository.findOne({
      where: { ubid },
    });
  }
}
