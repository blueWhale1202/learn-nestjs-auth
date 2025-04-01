import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SendOtpDto {
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
