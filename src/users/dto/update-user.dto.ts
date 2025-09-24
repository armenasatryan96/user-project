import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

/**
 * DTO для обновления пользователя
 */
export class UpdateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'newemail@example.com',
    format: 'email',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  email?: string;

  @ApiProperty({
    description: 'Новый пароль',
    example: 'newpassword123',
    minLength: 6,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @MaxLength(50, { message: 'Пароль не должен превышать 50 символов' })
  password?: string;
}
