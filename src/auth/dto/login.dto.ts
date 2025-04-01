import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    phone: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
