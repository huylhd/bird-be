import { Module } from '@nestjs/common';
import { HouseModule } from '../house/house.module';
import { TaskService } from './task.service';

@Module({
  imports: [HouseModule],
  providers: [TaskService],
})
export class TaskModule {}
