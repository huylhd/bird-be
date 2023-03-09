import {
  IsString,
  IsNumber,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class SingleHouseRequest {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  name: string;

  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;
}

export class CreateHouseRequest {
  @ValidateNested()
  houses: SingleHouseRequest[];
}
