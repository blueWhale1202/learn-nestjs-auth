import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, url, body } = req;
        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(
                `[${method}] ${url} - ${res.statusCode} (${duration}ms)`,
            );

            if (body) {
                console.log(`🚚 ~ Request Body`);
                console.dir(body, { depth: null });
            }

            if (res.statusCode >= 400) {
                console.error(`Error: ${res.statusMessage}`);
            }
        });

        next();
    }
}
