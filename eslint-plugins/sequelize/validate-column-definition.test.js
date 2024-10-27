import { ruleTester } from '../test/rule-tester.js';
import { validateColumnDefinitionRule } from './validate-column-definition.js';

ruleTester.run('validate-column-definition', validateColumnDefinitionRule, {
  valid: [
    {
      code: `
        class User {
          @Column({ type: DataTypes.TEXT, allowNull: true })
          declare name: string | null;
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
    {
      code: `
        class User {
          @Column({ type: DataTypes.INTEGER, primaryKey: true })
          declare id: number;
        }
      `,
    },
  ],
  invalid: [
    // Missing `allowNull` field
    {
      code: `
        class User {
          @Column({ type: DataTypes.TEXT })
          declare name: string;
        }
      `,
      output: `
        class User {
          @Column({ type: DataTypes.TEXT, allowNull: true })
          declare name: string;
        }
      `,
      errors: [
        {
          messageId: 'requireAllowNullInColumn',
        },
      ],
    },
    {
      code: `
        class User {
          @Column({
            type: DataTypes.TEXT,
            validate: { isString: true }
          })
          declare name: string;
        }
      `,
      output: `
        class User {
          @Column({
            type: DataTypes.TEXT,
            validate: { isString: true }, allowNull: true
          })
          declare name: string;
        }
      `,
      errors: [
        {
          messageId: 'requireAllowNullInColumn',
        },
      ],
    },
    // Missing `type` field
    {
      code: `
        class User {
          @Column({ allowNull: true })
          declare name: string;
        }
      `,
      errors: [
        {
          messageId: 'requireTypeInColumn',
        },
      ],
    },
    // Missing both
    {
      code: `
        class User {
          @Column({})
          declare name: string;
        }
      `,
      output: `
        class User {
          @Column({ allowNull: true })
          declare name: string;
        }
      `,
      errors: [
        {
          messageId: 'requireTypeInColumn',
        },
        {
          messageId: 'requireAllowNullInColumn',
        },
      ],
    },
    // Missing options altogether
    {
      code: `
        class User {
          @Column()
          declare name: string;
        }
      `,
      errors: [
        {
          messageId: 'requireOptions',
        },
      ],
    },
  ],
});