import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Сервис для работы с Prisma ORM
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Подключение к базе данных при инициализации модуля
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /**
   * Отключение от базы данных при завершении работы модуля
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
