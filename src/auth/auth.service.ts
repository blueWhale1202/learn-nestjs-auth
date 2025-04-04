import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OtpService } from 'src/otp/otp.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private otpService: OtpService,
    ) {}

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async comparePasswords(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async generateJwt(user: any): Promise<string> {
        return this.jwtService.sign({
            sub: user.id,
            phone: user.phone,
            role: user.role,
        });
    }

    async loginUser(user: any, response: any) {
        const token = await this.generateJwt(user);
        response.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });
        return {
            message: 'Login successful',
            user: { id: user.id, phone: user.phone, role: user.role },
        };
    }

    async logoutUser(response: any) {
        response.clearCookie('access_token');
        return { message: 'Logout successful' };
    }

    async validateUser(phone: string, password: string): Promise<any> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { phone },
            });
            if (
                user &&
                (await this.comparePasswords(password, user.password))
            ) {
                return user;
            }
            return null;
        } catch (error) {
            throw new UnauthorizedException('User validation failed');
        }
    }

    async registerUser(phone: string, hashedPassword: string): Promise<any> {
        const user = await this.prisma.user.create({
            data: { phone, password: hashedPassword, role: 'user' },
        });

        await this.otpService.sendOtp(phone);
        return user;
    }

    async verifyUserPhone(phone: string) {
        return this.prisma.user.update({
            where: { phone },
            data: { isVerified: true },
        });
    }

    async requestPasswordReset(phone: string): Promise<string> {
        const user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user) {
            throw new UnauthorizedException('Phone number not found');
        }

        await this.otpService.sendOtp(phone);
        return 'OTP sent for password reset';
    }

    async resetPassword(phone: string, newPassword: string): Promise<any> {
        const hashedPassword = await this.hashPassword(newPassword);
        return this.prisma.user.update({
            where: { phone },
            data: { password: hashedPassword },
        });
    }

    async getUserProfile(phone: string): Promise<any> {
        return this.prisma.user.findUnique({ where: { phone } });
    }
}
