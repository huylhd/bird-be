import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HouseService } from '../house/house.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly houseService: HouseService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  pruneHouses() {
    this.logger.debug('pruneHouses()');
    return this.houseService.pruneHouses();
  }
}
