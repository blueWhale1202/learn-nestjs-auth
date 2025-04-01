import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { OrdersModule } from './orders/orders.module';
import { OtpModule } from './otp/otp.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        OtpModule,
        UsersModule,
        ProductsModule,
        OrdersModule,
        OtpModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
