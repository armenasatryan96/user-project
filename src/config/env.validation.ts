import * as Joi from 'joi';

/**
 * Схема валидации переменных окружения
 */
export const envValidationSchema = Joi.object({
  // Основные настройки приложения
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  // База данных
  DATABASE_URL: Joi.string().required(),

  // JWT настройки
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),

  // Bcrypt настройки
  BCRYPT_ROUNDS: Joi.number().min(10).max(15).default(12),
});
