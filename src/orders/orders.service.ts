import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    async createOrder(userId: number, data: any) {
        return this.prisma.order.create({
            data: { ...data, userId },
        });
    }

    async getUserOrders(userId: number) {
        return this.prisma.order.findMany({ where: { userId } });
    }

    async getAllOrders() {
        return this.prisma.order.findMany();
    }

    async updateOrder(userId: number, orderId: number, data: any) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (order?.userId !== userId) {
            throw new ForbiddenException('You can only update your own orders');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data,
        });
    }

    async deleteOrder(userId: number, orderId: number) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (order?.userId !== userId) {
            throw new ForbiddenException('You can only delete your own orders');
        }
        return this.prisma.order.delete({ where: { id: orderId } });
    }
}
