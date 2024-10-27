import { ruleTester } from '../test/rule-tester.js';
import { validateTableDefinition } from './validate-table-definition.js';

ruleTester.run('validateTableDefinition', validateTableDefinition, {
  valid: [
    {
      code: `
        @Table({ tableName: 'users', underscored: true })
        class User {}
      `,
    },
    {
      code: `
        @Table({
          tableName: 'user_profiles',
          underscored: true,
          timestamps: false
        })
        class UserProfile {}
      `,
    },
    {
      code: `
        @Table({
          tableName: 'organizations',
          underscored: true,
          schema: 'public'
        })
        class Organization {}
      `,
    },
  ],
  invalid: [
    // Missing `underscored` field
    {
      code: `
        @Table({ tableName: 'users' })
        class User {}
      `,
      output: `
        @Table({ tableName: 'users', underscored: true })
        class User {}
      `,
      errors: [
        {
          messageId: 'requireUnderscoredInTable',
        },
      ],
    },
    {
      code: `
        @Table({
          tableName: 'users',
          timestamps: false
        })
        class User {}
      `,
      output: `
        @Table({
          tableName: 'users',
          timestamps: false, underscored: true
        })
        class User {}
      `,
      errors: [
        {
          messageId: 'requireUnderscoredInTable',
        },
      ],
    },
    // Missing `tableName` field
    {
      code: `
        @Table({ underscored: true })
        class User {}
      `,
      errors: [
        {
          messageId: 'requireTableNameInTable',
        },
      ],
    },
    // Missing both
    {
      code: `
        @Table({})
        class User {}
      `,
      output: `
        @Table({ underscored: true })
        class User {}
      `,
      errors: [
        {
          messageId: 'requireTableNameInTable',
        },
        {
          messageId: 'requireUnderscoredInTable',
        },
      ],
    },
    // Missing options altogether
    {
      code: `
        @Table()
        class User {}
      `,
      errors: [
        {
          messageId: 'requireOptions',
        },
      ],
    },
  ],
});
