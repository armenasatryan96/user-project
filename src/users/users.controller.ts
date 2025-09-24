import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponse } from '../common/interfaces/api-response.interface';

/**
 * Users controller
 */
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile' })
  @SwaggerApiResponse({
    status: 200,
    description: 'User profile',
    type: UserResponseDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'Access denied',
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<UserResponseDto> {
    return await this.usersService.findOne(id, currentUser.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @SwaggerApiResponse({
    status: 200,
    description: 'User profile updated',
    type: UserResponseDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'Access denied',
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'User not found',
  })
  @SwaggerApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<UserResponseDto> {
    return await this.usersService.update(
      id,
      updateUserDto,
      currentUser.id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @SwaggerApiResponse({
    status: 200,
    description: 'User successfully deleted',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'User successfully deleted' },
          },
        },
        error: { type: 'null' },
      },
    },
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'Access denied',
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'User not found',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; email: string },
  ): Promise<{ message: string }> {
    return await this.usersService.remove(id, currentUser.id);
  }
}
