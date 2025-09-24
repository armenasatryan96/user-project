import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { BaseRepository } from './base.repository';
import { IUserRepository } from './interfaces/user.repository.interface';

/**
 * Prisma implementation of user repository
 */
@Injectable()
export class PrismaUserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  /**
   * Create new user
   */
  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error: any) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find all users
   */
  async findMany(options?: { skip?: number; take?: number }): Promise<User[]> {
    const queryOptions: {
      skip?: number;
      take?: number;
      orderBy: { createdAt: 'desc' };
    } = {
      orderBy: { createdAt: 'desc' },
    };

    if (options?.skip !== undefined) {
      queryOptions.skip = options.skip;
    }

    if (options?.take !== undefined) {
      queryOptions.take = options.take;
    }

    return this.prisma.user.findMany(queryOptions);
  }

  /**
   * Update user
   */
  async update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Implementation of BaseRepository abstract methods
   */
  async findOne(id: string): Promise<User | null> {
    return this.findById(id);
  }
}
