import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) {}

    @Get()
    async getAllProducts(@Query() query: PaginationQueryDto) {
        return this.productsService.getAllProducts(query);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    async createProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    async updateProduct(
        @Param('id') id: number,
        @Body() body: UpdateProductDto,
    ) {
        return this.productsService.updateProduct(id, body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    async deleteProduct(@Param('id') id: number) {
        return this.productsService.deleteProduct(id);
    }
}
