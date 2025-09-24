/**
 * Единый формат ответа API для всех эндпоинтов
 */
export interface ApiResponse<T> {
  data: T | null;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    [key: string]: unknown;
  };
  error?: string | null;
}

/**
 * Успешный ответ с данными
 */
export interface SuccessResponse<T> extends ApiResponse<T> {
  data: T;
  error: null;
}

/**
 * Ответ с ошибкой
 */
export interface ErrorResponse extends ApiResponse<null> {
  data: null;
  error: string;
}
