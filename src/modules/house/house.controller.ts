import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards';
import { formatHouse } from 'src/helpers';
import { CreateHouseRequest } from './dto/create-house.dto';
import { UpdateHouseRequest } from './dto/update-house.dto';
import { UpdateOccupancyRequest } from './dto/update-occupancy.dto';
import { House } from './entities/house.entity';
import { HouseService } from './house.service';

@Controller('houses')
export class HouseController {
  constructor(private houseService: HouseService) {}

  @Post()
  create(@Body() dto: CreateHouseRequest): Promise<House[]> {
    return this.houseService.createBulk(dto);
  }

  @Patch(':ubid')
  @UseGuards(AuthGuard)
  async update(
    @Request() req,
    @Body() dto: UpdateHouseRequest,
  ): Promise<Partial<House>> {
    const house = await this.houseService.update({
      ubid: req.house.ubid,
      dto,
      house: req.house,
    });
    return formatHouse(house);
  }

  @Post(':ubid/occupancy')
  @HttpCode(201)
  @UseGuards(AuthGuard)
  async updateOccupancy(
    @Request() req,
    @Body() dto: UpdateOccupancyRequest,
  ): Promise<Partial<House>> {
    const house = await this.houseService.updateOccupancy({
      ubid: req.house.ubid,
      dto,
      house: req.house,
    });
    return formatHouse(house);
  }

  @Get(':ubid')
  @UseGuards(AuthGuard)
  getByUbid(@Request() req): Partial<House> {
    return formatHouse(req.house);
  }
}
