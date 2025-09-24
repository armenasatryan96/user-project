import { PrismaService } from '@/database/prisma.service';

/**
 * Абстрактный базовый репозиторий с CRUD операциями
 */
export abstract class BaseRepository<T> {
  constructor(protected readonly prisma: PrismaService) {}

  /**
   * Создать новую запись
   */
  abstract create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;

  /**
   * Найти запись по ID
   */
  abstract findOne(id: string): Promise<T | null>;

  /**
   * Найти множество записей
   */
  abstract findMany(options?: {
    skip?: number;
    take?: number;
    where?: Partial<T>;
  }): Promise<T[]>;

  /**
   * Обновить запись
   */
  abstract update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<T>;

  /**
   * Удалить запись
   */
  abstract delete(id: string): Promise<T>;
}
