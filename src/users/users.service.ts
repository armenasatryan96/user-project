import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

/**
 * Сервис для работы с пользователями
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: PrismaUserRepository,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get user profile
   */
  async findOne(id: string, currentUserId: string): Promise<UserResponseDto> {
    // Check that user can only access their own profile
    if (id !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update user profile
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<UserResponseDto> {
    // Check that user can only update their own profile
    if (id !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prepare data for update
    const updateData: Partial<{ email: string; password: string }> = {};

    // If email is being updated, check uniqueness
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException(
          'User with this email already exists',
        );
      }
      updateData.email = updateUserDto.email;
    }

    // If password is being updated, hash it
    if (updateUserDto.password) {
      const saltRounds = this.configService.get<number>('bcrypt.rounds') || 12;
      updateData.password = await bcrypt.hash(
        updateUserDto.password,
        saltRounds,
      );
    }

    // Update user
    const updatedUser = await this.userRepository.update(id, updateData);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * Delete user
   */
  async remove(
    id: string,
    currentUserId: string,
  ): Promise<{ message: string }> {
    // Check that user can only delete their own profile
    if (id !== currentUserId) {
      throw new ForbiddenException('Access denied');
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);

    return {
      message: 'User successfully deleted',
    };
  }
}
