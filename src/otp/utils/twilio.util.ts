import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

let client: Twilio;
let messagingServiceSid: string;

export function initTwilio(configService: ConfigService): void {
    const accountSid = configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = configService.get<string>('TWILIO_AUTH_TOKEN');
    messagingServiceSid = configService.get<string>(
        'TWILIO_MESSAGING_SERVICE_SID',
    )!;

    if (!accountSid || !authToken || !messagingServiceSid) {
        console.error(
            'Twilio configuration error: Missing Account SID, Auth Token, or Messaging Service SID',
        );
        throw new Error('Twilio configuration error');
    }

    client = new Twilio(accountSid, authToken);
    console.log(
        `🚀 ~ Twilio client initialized with Messaging Service SID: ${messagingServiceSid}`,
    );
}

export async function sendOtpViaTwilio(
    phone: string,
    otp: string,
): Promise<void> {
    try {
        await client.messages.create({
            body: `Your OTP code is: ${otp}`,
            messagingServiceSid,
            to: '+84376531752', // replace with the actual phone number
        });
    } catch (error) {
        console.error(`Failed to send OTP via Twilio: ${error.message}`);
        throw new Error('Could not send OTP. Please try again later.');
    }
}
