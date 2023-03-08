import { IsInt } from 'class-validator';

export class UpdateOccupancyRequest {
  @IsInt()
  birds: number;

  @IsInt()
  eggs: number;
}
