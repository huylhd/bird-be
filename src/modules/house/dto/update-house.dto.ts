import { PartialType } from '@nestjs/mapped-types';
import { CreateHouseRequest } from './create-house.dto';

export class UpdateHouseRequest extends PartialType(CreateHouseRequest) {}
