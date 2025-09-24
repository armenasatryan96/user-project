import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { PrismaService } from '../database/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaUserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOne', () => {
    it('should return user if found and user is owner', async () => {
      const userId = '1';
      const currentUserId = '1';

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne(userId, currentUserId);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '999';
      const currentUserId = '999';

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(userId, currentUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const userId = '1';
      const currentUserId = '2';

      mockUserRepository.findById.mockResolvedValue(mockUser);

      await expect(service.findOne(userId, currentUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    it('should update user if found and user is owner', async () => {
      const userId = '1';
      const currentUserId = '1';
      const updateDto = { email: 'newemail@example.com' };
      const updatedUser = { ...mockUser, ...updateDto };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue(null); // Email is unique
      mockUserRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateDto, currentUserId);

      expect(result).toEqual({
        id: updatedUser.id,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateDto);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '999';
      const currentUserId = '999';
      const updateDto = { email: 'newemail@example.com' };

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(
        service.update(userId, updateDto, currentUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const userId = '1';
      const currentUserId = '2';
      const updateDto = { email: 'newemail@example.com' };

      mockUserRepository.findById.mockResolvedValue(mockUser);

      await expect(
        service.update(userId, updateDto, currentUserId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should delete user if found and user is owner', async () => {
      const userId = '1';
      const currentUserId = '1';

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(mockUser);

      const result = await service.remove(userId, currentUserId);

      expect(result).toEqual({
        message: 'User successfully deleted',
      });
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      const userId = '999';
      const currentUserId = '999';

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.remove(userId, currentUserId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const userId = '1';
      const currentUserId = '2';

      mockUserRepository.findById.mockResolvedValue(mockUser);

      await expect(service.remove(userId, currentUserId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
