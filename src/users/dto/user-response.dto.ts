import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для ответа с информацией о пользователе
 */
export class UserResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: 'uuid',
  })
  id!: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Дата создания пользователя',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Дата последнего обновления пользователя',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}
