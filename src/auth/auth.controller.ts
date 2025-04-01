import {
    Body,
    Controller,
    Get,
    Post,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { OtpService } from 'src/otp/otp.service';
import { errorResponse, successResponse } from 'src/utils/response.utils';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private otpService: OtpService,
    ) {}

    @Post('login')
    async login(@Body() body: LoginDto, @Res() response: Response) {
        try {
            const { phone, password } = body;
            const user = await this.authService.validateUser(phone, password);
            if (!user) {
                return response
                    .status(401)
                    .json({ message: 'Invalid credentials' });
            }
            await this.authService.loginUser(user, response);
            return response.status(200).json({ message: 'Login successful' });
        } catch (error) {
            return response
                .status(500)
                .json({ message: 'Login failed', error: error.message });
        }
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Res() response: Response) {
        try {
            await this.authService.logoutUser(response);
            return response.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            return response
                .status(500)
                .json({ message: 'Logout failed', error: error.message });
        }
    }

    @Post('register')
    async register(@Body() body: any) {
        const { phone, password } = body;
        const hashedPassword = await this.authService.hashPassword(password);
        await this.authService.registerUser(phone, hashedPassword);
        return { message: 'User registered successfully' };
    }

    @Post('resend-otp')
    async resendOtp(@Body() body: any) {
        const { phone } = body;
        try {
            await this.otpService.sendOtp(phone);
            return { message: 'OTP resent successfully' };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    @Post('verify-otp')
    async verifyOtp(@Body() body: any) {
        const { phone, otp } = body;
        try {
            const isValid = this.otpService.verifyOtp(phone, otp);
            if (!isValid) {
                throw new UnauthorizedException('Invalid OTP');
            }
            await this.authService.verifyUserPhone(phone);
            return { message: 'Phone number verified successfully' };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    @Post('forgot-password')
    async forgotPassword(@Body() body: any) {
        const { phone } = body;
        try {
            await this.authService.requestPasswordReset(phone);
            return successResponse('Password reset OTP sent');
        } catch (error) {
            return errorResponse(error.message);
        }
    }

    @Post('reset-password')
    async resetPassword(@Body() body: any) {
        const { phone, otp, newPassword } = body;
        try {
            const isValid = this.otpService.verifyOtp(phone, otp);
            if (!isValid) {
                throw new UnauthorizedException('Invalid or expired OTP');
            }
            await this.authService.resetPassword(phone, newPassword);
            return { message: 'Password reset successfully' };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Body() body: any) {
        return { message: 'Profile data', data: body };
    }
}
