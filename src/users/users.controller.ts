import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { errorResponse, successResponse } from '../utils/response.utils';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('profile')
    async getProfile(@Req() req: any) {
        const userId = req.user.userId;
        try {
            const user = await this.usersService.getUserProfile(userId);
            if (!user) {
                return errorResponse('User not found');
            }
            return successResponse('User profile fetched successfully', user);
        } catch (error) {
            return errorResponse(error.message);
        }
    }

    @Patch('profile')
    async updateProfile(@Req() req: any, @Body() body: UpdateProfileDto) {
        const userId = req.user.userId;
        try {
            const updatedUser = await this.usersService.updateUserProfile(
                userId,
                body,
            );
            return successResponse(
                'User profile updated successfully',
                updatedUser,
            );
        } catch (error) {
            return errorResponse(error.message);
        }
    }

    @Delete('profile')
    async deleteProfile(@Req() req: any) {
        const userId = req.user.userId;
        try {
            await this.usersService.deleteUserProfile(userId);
            return successResponse('User profile deleted successfully');
        } catch (error) {
            return errorResponse(error.message);
        }
    }
}
