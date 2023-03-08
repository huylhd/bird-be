/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateHouseRequest } from './dto/create-house.dto';
import { UpdateHouseRequest } from './dto/update-house.dto';
import { House } from './house.entity';
import { HouseService } from './house.service';

@Controller('house')
export class HouseController {
  constructor(private houseService: HouseService) {}

  @Post()
  create(@Body() dto: CreateHouseRequest): Promise<House> {
    return this.houseService.create(dto);
  }

  @Patch(':ubid')
  @UseGuards(AuthGuard)
  async update(
    @Request() req,
    @Body() dto: UpdateHouseRequest,
  ): Promise<Partial<House>> {
    const { id, ubid, ...house } = await this.houseService.update({
      ubid: req.house.ubid,
      dto,
      house: req.house,
    });
    return house;
  }

  @Get(':ubid')
  @UseGuards(AuthGuard)
  getByUbid(@Request() req): Promise<Partial<House>> {
    const { id, ubid, ...house } = req.house;
    return house;
  }
}
