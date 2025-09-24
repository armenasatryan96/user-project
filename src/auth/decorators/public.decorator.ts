import { SetMetadata } from '@nestjs/common';

/**
 * Декоратор для обозначения публичных эндпоинтов (не требующих аутентификации)
 */
export const Public = () => SetMetadata('isPublic', true);
