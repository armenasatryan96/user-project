import { User } from '@prisma/client';

/**
 * Интерфейс репозитория для работы с пользователями
 */
export interface IUserRepository {
  /**
   * Создать нового пользователя
   */
  create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;

  /**
   * Найти пользователя по ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Найти пользователя по email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Найти всех пользователей
   */
  findMany(options?: { skip?: number; take?: number }): Promise<User[]>;

  /**
   * Обновить пользователя
   */
  update(
    id: string,
    data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<User>;

  /**
   * Удалить пользователя
   */
  delete(id: string): Promise<User>;
}
