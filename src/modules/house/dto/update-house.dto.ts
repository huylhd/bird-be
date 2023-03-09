import { PartialType } from '@nestjs/mapped-types';
import { SingleHouseRequest } from './create-house.dto';

export class UpdateHouseRequest extends PartialType(SingleHouseRequest) {}
