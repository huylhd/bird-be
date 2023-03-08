import { IsString, IsNumber, MaxLength, MinLength } from 'class-validator';

export class CreateHouseRequest {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  name: string;

  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;
}
