import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
