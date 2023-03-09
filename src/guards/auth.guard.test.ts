import {
  AuthGuard,
  XUbidHeaderInvalidError,
  XUbidHeaderMissingError,
} from './auth.guard';
jest.mock('src/modules/house/house.service');

describe('AuthGuard', () => {
  let mockGetByUbid: any, mockHouseService: any, authGuard: AuthGuard;
  beforeEach(() => {
    mockGetByUbid = jest
      .fn()
      .mockImplementation((ubid) => (ubid === 1 ? ubid : null));
    mockHouseService = { getByUbid: mockGetByUbid };
    authGuard = new AuthGuard(mockHouseService);
  });

  describe('x-ubid header missing', () => {
    it('should throw XUbidHeaderMissingError', async () => {
      const mockExecutionContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      };
      await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
        XUbidHeaderMissingError,
      );
      expect(mockGetByUbid).toBeCalledTimes(0);
    });
  });

  describe('x-ubid header invalid', () => {
    describe('x-ubid header not matching params ubid', () => {
      it('should throw XUbidHeaderInvalidError', async () => {
        const mockExecutionContext: any = {
          switchToHttp: () => ({
            getRequest: () => ({
              headers: { 'x-ubid': 1 },
              params: { ubid: 2 },
            }),
          }),
        };
        await expect(
          authGuard.canActivate(mockExecutionContext),
        ).rejects.toThrow(XUbidHeaderInvalidError);
        expect(mockGetByUbid).toBeCalledTimes(0);
      });
    });

    describe('ubid not found', () => {
      it('should throw XUbidHeaderInvalidError', async () => {
        const mockExecutionContext: any = {
          switchToHttp: () => ({
            getRequest: () => ({
              headers: { 'x-ubid': 2 },
              params: { ubid: 2 },
            }),
          }),
        };
        await expect(
          authGuard.canActivate(mockExecutionContext),
        ).rejects.toThrow(XUbidHeaderInvalidError);
        expect(mockGetByUbid).toBeCalledTimes(1);
      });
    });
  });

  describe('success', () => {
    it('should return true', () => {
      const mockExecutionContext: any = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { 'x-ubid': 1 },
            params: { ubid: 1 },
          }),
        }),
      };
      return authGuard.canActivate(mockExecutionContext).then((res) => {
        expect(res).toBe(true);
        expect(mockGetByUbid).toBeCalledTimes(1);
      });
    });
  });
});
