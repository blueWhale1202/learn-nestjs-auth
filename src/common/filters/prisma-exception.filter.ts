import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(
        exception: Prisma.PrismaClientKnownRequestError,
        host: ArgumentsHost,
    ) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Something went wrong';

        switch (exception.code) {
            case 'P2002': // Unique constraint failed
                status = HttpStatus.CONFLICT;
                message = 'Resource already exists';
                break;
            case 'P2025': // Record not found
                status = HttpStatus.NOT_FOUND;
                message = 'Resource not found';
                break;
            default:
                console.error('Unhandled Prisma error:', exception);
        }

        response.status(status).json({
            success: false,
            message,
            error: exception.message,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
