import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { OtpService } from 'src/otp/otp.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'supersecret',
            signOptions: { expiresIn: '1h' },
        }),
        PrismaModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, OtpService],
    exports: [AuthService],
})
export class AuthModule {}
