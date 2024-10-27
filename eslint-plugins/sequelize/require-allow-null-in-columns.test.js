import { ruleTester } from '../test/rule-tester.js';
import { requireAllowNullInColumnsRule } from './require-allow-null-in-columns.js';

ruleTester.run('require-allow-null-in-columns', requireAllowNullInColumnsRule, {
  valid: [
    {
      code: `
        class User {
          @Column({ type: DataTypes.TEXT, allowNull: true })
          declare name: string;
        }
      `,
    },
    {
      code: `
        class User {
          @Column({ type: DataTypes.TEXT, allowNull: false })
          declare name: string;
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        class User {
          @Column({ type: DataTypes.TEXT })
          declare name: string;
        }
      `,
      errors: [
        {
          messageId: 'requireAllowNullInColumn',
        },
      ],
    },
  ],
});
