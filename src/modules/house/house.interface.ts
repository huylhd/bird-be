import { UpdateHouseRequest } from './dto/update-house.dto';
import { UpdateOccupancyRequest } from './dto/update-occupancy.dto';
import { House } from './entities/house.entity';

export interface UpdateHouseParams {
  ubid: string;
  dto: UpdateHouseRequest;
  house?: House;
}

export interface UpdateOccupancyParams {
  ubid: string;
  dto: UpdateOccupancyRequest;
  house?: House;
}
