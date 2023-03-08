import { Body, Controller, Post } from '@nestjs/common';
import { CreateHouseRequest } from './dto/create-house.dto';
import { House } from './house.entity';
import { HouseService } from './house.service';

@Controller('house')
export class HouseController {
  constructor(private houseService: HouseService) {}

  @Post()
  create(@Body() dto: CreateHouseRequest): Promise<House> {
    return this.houseService.create(dto);
  }
}
