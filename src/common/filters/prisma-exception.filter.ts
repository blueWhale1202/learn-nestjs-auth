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
            case 'P2000':
                status = HttpStatus.BAD_REQUEST;
                message = `The provided value is too long for the column: ${exception.meta?.column_name}`;
                break;

            case 'P2001':
                status = HttpStatus.NOT_FOUND;
                message = `Record not found: ${exception.meta?.model_name}.${exception.meta?.argument_name}`;
                break;

            case 'P2002':
                status = HttpStatus.CONFLICT;
                message = `Unique constraint failed on the field: ${exception.meta?.target}`;
                break;

            case 'P2003':
                status = HttpStatus.BAD_REQUEST;
                message = `Foreign key constraint failed on the field: ${exception.meta?.field_name}`;
                break;

            case 'P2011':
                status = HttpStatus.BAD_REQUEST;
                message = `Null constraint violation on the field: ${exception.meta?.constraint}`;
                break;

            case 'P2025':
                status = HttpStatus.NOT_FOUND;
                message = `An operation failed because it depends on one or more records that were required but not found: ${exception.meta?.cause}`;
                break;

            case 'P2030':
                status = HttpStatus.BAD_REQUEST;
                message = `Fulltext index not found. Please check your schema configuration.`;
                break;

            case 'P2033':
                status = HttpStatus.BAD_REQUEST;
                message = `A number in the query does not fit into a 64-bit signed integer. Consider using BigInt as field type.`;
                break;

            default:
                message = exception.message;
                break;
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
