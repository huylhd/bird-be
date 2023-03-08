import { UpdateHouseRequest } from './dto/update-house.dto';
import { House } from './house.entity';

export interface UpdateHouseParams {
  ubid: string;
  dto: UpdateHouseRequest;
  house?: House;
}
