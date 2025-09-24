import { ApiProperty } from '@nestjs/swagger';

/**
 * Authentication response DTO
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'uuid' },
      email: { type: 'string', example: 'user@example.com' },
    },
  })
  user!: {
    id: string;
    email: string;
  };
}
