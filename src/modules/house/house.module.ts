import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseController } from './house.controller';
import { House } from './entities/house.entity';
import { HouseHistory } from './entities/house-history.entity';
import { HouseService } from './house.service';

@Module({
  imports: [TypeOrmModule.forFeature([House, HouseHistory])],
  controllers: [HouseController],
  providers: [HouseService],
  exports: [HouseService],
})
export class HouseModule {}
