import { ruleTester } from '../test/rule-tester.js';
import { requireInferAttributesInModelsRule } from './require-infer-attributes-in-models.js';

ruleTester.run('require-infer-attributes-in-models', requireInferAttributesInModelsRule, {
  valid: [
    // No Model or Table import - rule shouldn't apply
    {
      code: `
        import { DataTypes } from 'sequelize';
      `,
    },
    // Only Model without Table - rule shouldn't apply
    {
      code: `
        import { Model } from 'sequelize-typescript';
        import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
      `,
    },
    // Has both required imports
    {
      code: `
        import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
        import { Model, Table } from 'sequelize-typescript';
      `,
    },
    // Has both required imports with type syntax
    {
      code: `
        import { DataTypes, type InferAttributes, type InferCreationAttributes } from 'sequelize';
        import { Model, Table } from 'sequelize-typescript';
      `,
    },
  ],
  invalid: [
    // Missing both InferAttributes
    {
      code: `
        import { DataTypes, InferCreationAttributes } from 'sequelize';
        import { Model, Table } from 'sequelize-typescript';
      `,
      errors: [
        {
          messageId: 'missingInferAttributesInModel',
        },
      ],
    },
    // Missing InferCreationAttributes
    {
      code: `
        import { DataTypes, InferAttributes } from 'sequelize';
        import { Model, Table } from 'sequelize-typescript';
      `,
      errors: [
        {
          messageId: 'missingInferAttributesInModel',
        },
      ],
    },
  ],
});