import axios from 'axios';

export async function sendOtpViaESMS(phone: string, otp: string): Promise<any> {
    const apiUrl =
        'https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/';

    const body = {
        ApiKey: process.env.ESMS_API_KEY,
        SecretKey: process.env.ESMS_SECRET_KEY,
        Content: `${otp} la ma xac minh dang ky Baotrixemay cua ban`,
        Phone: phone,
        Brandname: 'Baotrixemay',
        SmsType: '2',
        IsUnicode: '0',
        Sandbox: '1', // Set to '1' for testing, '0' for production
    };

    try {
        const response = await axios.post(apiUrl, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
}
