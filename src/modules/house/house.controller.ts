import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
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

  @Get(':ubid')
  @UseGuards(AuthGuard)
  getByUbid(@Request() req) {
    const { id, ubid, ...houseData } = req.house;
    return houseData;
  }
}
