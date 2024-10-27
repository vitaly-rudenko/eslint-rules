import { ruleTester } from '../test/rule-tester.js';
import { validateTableDefinition } from './validate-table-definition.js';

ruleTester.run('validate-table-definition', validateTableDefinition, {
  valid: [
    {
      code: `
        @Table({ tableName: 'users', underscored: true })
        class User {
          declare id: string;
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        @Table({ tableName: 'users' })
        class User {
          declare id: string;
        }
      `,
      errors: [
        {
          messageId: 'requireUnderscoredInTable',
        },
      ],
    },
    {
      code: `
        @Table({ underscored: true })
        class User {
          declare id: string;
        }
      `,
      errors: [
        {
          messageId: 'requireTableNameInTable',
        },
      ],
    },
  ],
});
