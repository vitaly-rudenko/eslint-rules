// @ts-check

import eslint from '@eslint/js';
import * as importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { eslintSequelizePlugin } from './eslint-plugins/sequelize/index.js';

const noRestrictedImportsConfig = {
  paths: [
    // Avoid accidentally importing from `sequelize`
    {
      name: 'sequelize',
      importNames: ['BelongsToMany', 'BelongsTo', 'HasMany', 'HasOne'],
      message: 'Import from `sequelize-typescript` instead',
    },
    // @CreatedAt, @UpdatedAt and @DeletedAt are confusing and produce unexpected column names
    // @Comment and @Unique are redundant and can be achieved with @Column
    {
      name: 'sequelize-typescript',
      importNames: ['CreatedAt', 'UpdatedAt', 'DeletedAt', 'Comment', 'Unique'],
      message: 'Forbidden decorator',
    }
  ],
  patterns: [
    // Only allow certain imports from lodash
    {
      group: ['lodash'],
      importNamePattern: '^(?!(?:omit|uniq)$).*$',
      message: 'This lodash import is not whitelisted in ESLint config',
    },
    // Disallow lodash/* imports to be able to apply the rule above more consistently ^
    {
      group: ['lodash/*'],
      message: 'Import from `lodash` instead of `lodash/*`',
    },
  ]
}

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      sequelize: eslintSequelizePlugin,
      import: importPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',

      'no-restricted-properties': [
        'warn',
        {
          property: 'findByPk',
          message: 'Use findOne({ where: { id } }) instead of findByPk(id)'
        },
        // https://sequelize.org/docs/v6/other-topics/transactions
        {
          object: 'transaction',
          property: 'commit',
          message: 'Avoid using unmanaged transactions'
        },
        {
          property: 'forEach',
          message: 'Use modern for..of syntax for iterating through iterables'
        }
      ],

      'no-restricted-imports': ['error', noRestrictedImportsConfig],

      'no-restricted-syntax': [
        'error',
        // Disallow native TypeScript enums in favor of string literals (unions)
        {
          selector: 'TSEnumDeclaration',
          message: 'Use string literals (unions) instead of enums',
        },
      ],

      // custom
      'sequelize/no-limit-or-order-in-associations': 'error',
      'sequelize/require-allow-null-in-columns': 'error',
      'sequelize/require-attributes-in-queries': 'error',
      'sequelize/require-limit-in-find-all': 'warn',
      'sequelize/require-required-in-associations': 'error',
      'sequelize/separate-not-required-in-associations': 'error',
      'sequelize/validate-references-in-columns': 'error',
      'sequelize/validate-table-definition': 'error',
      'sequelize/validate-through-associations': 'error',
    }
  },
  {
    files: ['**/*.ts'],
    ignores: ['**/*.controller.ts'],
    rules: {
      // Note: ESLint doesn't support combining warnings and errors in the same rule,
      //       so we use warning severity here for all imports
      'no-restricted-imports': ['warn', {
        ...noRestrictedImportsConfig,
        patterns: [
          ...noRestrictedImportsConfig.patterns,
          {
            group: ['**/*.dto', '**/*.dto.*'],
            message: 'DTOs can only be used in controller files',
          }
        ]
      }]
    }
  }
);
