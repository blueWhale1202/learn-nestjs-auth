import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private ordersService: OrdersService) {}

    @Post()
    async createOrder(@Req() req: any, @Body() body: any) {
        const userId = req.user.userId;
        return this.ordersService.createOrder(userId, body);
    }

    @Get()
    async getUserOrders(@Req() req: any) {
        const userId = req.user.userId;
        return this.ordersService.getUserOrders(userId);
    }

    @UseGuards(RolesGuard)
    @Roles('admin')
    @Get('all')
    async getAllOrders() {
        return this.ordersService.getAllOrders();
    }

    @Patch(':id')
    async updateOrder(
        @Req() req: any,
        @Param('id') id: number,
        @Body() body: any,
    ) {
        const userId = req.user.userId;
        return this.ordersService.updateOrder(userId, id, body);
    }

    @Delete(':id')
    async deleteOrder(@Req() req: any, @Param('id') id: number) {
        const userId = req.user.userId;
        return this.ordersService.deleteOrder(userId, id);
    }
}
