import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.debug('Successfully connected to the database');
        } catch (error) {
            this.logger.error(
                'Failed to connect to the database',
                error.message,
            );
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('Disconnected from the database');
        } catch (error) {
            this.logger.error(
                'Error during database disconnection',
                error.message,
            );
        }
    }
}
