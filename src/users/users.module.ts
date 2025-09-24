import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { PrismaService } from '../database/prisma.service';

/**
 * Users module
 */
@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaUserRepository, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
