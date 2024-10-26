import { ruleTester } from '../rule-tester.js';
import { requireAllowNullInColumnsRule } from './require-allow-null-in-columns.js';

ruleTester.run('require-allow-null-in-columns', requireAllowNullInColumnsRule, {
  valid: [
    {
      code: `
        class User {
          @Column({ type: DataTypes.TEXT, allowNull: true })
          name: string;
        }
      `,
    },
    {
      code: `
        class User {
          @Column({ type: DataTypes.TEXT, allowNull: false })
          name: string;
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        class User {
          @Column({ type: DataTypes.TEXT })
          name: string;
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
