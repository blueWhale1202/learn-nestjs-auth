import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;
}
