import { register } from 'tsconfig-paths';

// Регистрируем алиасы путей для Jest
register({
  baseUrl: './src',
  paths: {
    '@/*': ['*'],
  },
});
