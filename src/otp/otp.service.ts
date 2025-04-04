import { BadRequestException, Injectable } from '@nestjs/common';
import { sendOtpViaTwilio } from './utils/twilio.util';

@Injectable()
export class OtpService {
    private otpThrottle = new Map<string, number>();
    private otpStore = new Map<string, string>();

    generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    private canSendOtp(phone: string): boolean {
        const lastSentAt = this.otpThrottle.get(phone);
        if (!lastSentAt) return true;
        const currentTime = Date.now();
        return currentTime - lastSentAt >= 60000;
    }

    private updateThrottle(phone: string): void {
        this.otpThrottle.set(phone, Date.now());
        setTimeout(() => {
            this.otpThrottle.delete(phone);
            console.log(`Throttle for ${phone} cleared after 60 seconds.`);
        }, 60000);
    }

    private storeOtp(phone: string, otp: string): void {
        this.otpStore.set(phone, otp);
        setTimeout(() => {
            this.otpStore.delete(phone);
            console.log(`OTP for ${phone} has expired and been removed.`);
        }, 60000);
    }

    async sendOtp(phone: string): Promise<string> {
        if (!this.canSendOtp(phone)) {
            throw new Error(
                'OTP has already been sent, please wait 60 seconds to resend.',
            );
        }

        const otp = this.generateOtp();
        await sendOtpViaTwilio(phone, otp);
        this.storeOtp(phone, otp);
        this.updateThrottle(phone);
        console.log(`OTP sent to ${phone}: ${otp}`);
        return otp;
    }

    verifyOtp(phone: string, otp: string): boolean {
        const storedOtp = this.otpStore.get(phone);
        if (!storedOtp) {
            // throw new BadRequestException('OTP không tồn tại hoặc đã hết hạn.');
            throw new BadRequestException('OTP does not exist or has expired.');
        }

        if (storedOtp !== otp) {
            throw new BadRequestException('OTP is incorrect.');
        }

        this.otpStore.delete(phone);
        console.log(`OTP for ${phone} verified and removed.`);
        return true;
    }
}
