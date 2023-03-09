import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger();
  use(req: any, res: any, next: () => void) {
    const logger = this.logger;
    const traceId = req.headers['x-trace-id'] || randomUUID();
    req.traceId = traceId;
    res.setHeader('x-trace-id', traceId);

    // Request logging
    const { method, originalUrl, headers, body } = req;
    logger.log(
      `[${traceId}] \x1b[35m${originalUrl}\x1b[0m - Headers: ${JSON.stringify(
        headers,
      )}, \x1b[32mBody: ${JSON.stringify(body)}\x1b[0m`,
      `${method} - Request`,
    );

    // Response logging
    const originalSend = res.send;
    res.send = function (body: any) {
      logger.log(
        `[${traceId}] \x1b[35m${originalUrl}\x1b[0m - Status: ${
          res.statusCode
        } - \x1b[32mBody: ${JSON.stringify(body)}\x1b[0m`,
        `${method} - Response`,
      );
      originalSend.call(this, body);
    };
    next();
  }
}
