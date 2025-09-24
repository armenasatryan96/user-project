import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to get current user from JWT token
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): { id: string; email: string } => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
