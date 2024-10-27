import { ruleTester } from '../test/rule-tester.js';
import { validateReferencesInColumnsRule } from './validate-references-in-columns.js';

ruleTester.run('validate-references-in-columns', validateReferencesInColumnsRule, {
  valid: [
    {
      code: `
        class User {
          @Column({
            type: DataTypes.UUID,
            references: { model: { tableName: 'organizations' }, key: 'id' },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          })
          declare organizationId: string;

          @Column({ type: DataTypes.UUID })
          declare externalId: string;
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        class User {
          @Column({
            type: DataTypes.UUID,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          })
          declare organizationId: string;
        }
      `,
      errors: [
        {
          messageId: 'requireReferencesInColumn',
        },
      ],
    },
    {
      code: `
        class User {
          @Column({
            type: DataTypes.UUID,
            references: { model: { tableName: 'organizations' }, key: 'id' },
          })
          declare organizationId: string;
        }
      `,
      errors: [
        {
          messageId: 'requireReferencesInColumn',
        },
      ],
    },
  ],
});
