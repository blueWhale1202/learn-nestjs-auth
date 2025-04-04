import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalFilters(new PrismaClientExceptionFilter());

    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://10.0.2.2:3000',
            'http://192.168.1.57:3000',
        ],

        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    });

    await app.listen(8080);
    console.log('🚀 ~ Server running on http://localhost:8080/api/v1');
}

bootstrap();
