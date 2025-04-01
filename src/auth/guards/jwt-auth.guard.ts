import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies?.access_token;
        if (!token) {
            throw new UnauthorizedException('No token found in cookies');
        }
        request.headers.authorization = `Bearer ${token}`;
        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw err || new UnauthorizedException('Unauthorized');
        }
        return user;
    }
}
