import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { HouseService } from 'src/modules/house/house.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly houseService: HouseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const ubidHeader = req.headers['x-ubid'];
    const ubidParam = req.params.ubid;

    if (!ubidHeader) {
      throw new UnauthorizedException('X-UBID header is missing');
    }
    if (ubidParam && ubidParam !== ubidHeader) {
      throw new UnauthorizedException('X-UBID header is invalid');
    }

    const house = await this.houseService.getByUbid(ubidHeader);
    if (!house) {
      throw new UnauthorizedException('X-UBID header is invalid');
    }

    req.house = house;
    return true;
  }
}
