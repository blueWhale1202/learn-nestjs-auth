import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getUserProfile(userId: number) {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }

    async updateUserProfile(userId: number, data: any) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async deleteUserProfile(userId: number) {
        return this.prisma.user.delete({ where: { id: userId } });
    }
}
