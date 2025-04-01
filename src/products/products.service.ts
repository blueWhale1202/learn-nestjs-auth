import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { getPagination, getSortOrder } from 'src/common/utils/pagination.utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async getAllProducts(query: PaginationQueryDto) {
        const { page, pageSize, sortBy, order, filter } = query;
        const { limit, offset } = getPagination(page, pageSize);

        const where = filter
            ? { name: { contains: filter, mode: Prisma.QueryMode.insensitive } }
            : {};
        const orderBy = sortBy ? getSortOrder(sortBy, order) : {};

        const products = await this.prisma.product.findMany({
            where,
            orderBy,
            skip: offset,
            take: limit,
        });

        const totalItems = await this.prisma.product.count({ where });
        const totalPages = Math.ceil(totalItems / (pageSize || 1));

        return {
            data: products,
            pagination: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize,
            },
        };
    }

    async getProductById(id: number) {
        return this.prisma.product.findUnique({ where: { id } });
    }

    async createProduct(data: any) {
        return this.prisma.product.create({ data });
    }

    async updateProduct(id: number, data: any) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async deleteProduct(id: number) {
        return this.prisma.product.delete({ where: { id } });
    }
}
