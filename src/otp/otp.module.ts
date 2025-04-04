import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtpService } from './otp.service';
import { initTwilio } from './utils/twilio.util';

@Module({
    providers: [OtpService],
    exports: [OtpService],
})
export class OtpModule implements OnModuleInit {
    constructor(private configService: ConfigService) {}

    onModuleInit() {
        initTwilio(this.configService);
    }
}
