import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { HouseService } from 'src/modules/house/house.service';

export const XUbidHeaderMissingError = new UnauthorizedException(
  'X-UBID header is missing',
);
export const XUbidHeaderInvalidError = new UnauthorizedException(
  'X-UBID header is invalid',
);
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly houseService: HouseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const ubidHeader = req.headers['x-ubid'];
    const ubidParam = req.params?.ubid;

    if (!ubidHeader) {
      throw XUbidHeaderMissingError;
    }
    if (ubidParam && ubidParam !== ubidHeader) {
      throw XUbidHeaderInvalidError;
    }

    const house = await this.houseService.getByUbid(ubidHeader);
    if (!house) {
      throw XUbidHeaderInvalidError;
    }

    req.house = house;
    return true;
  }
}
