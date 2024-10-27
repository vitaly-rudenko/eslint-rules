import { ruleTester } from '../test/rule-tester.js';
import { requireInferAttributesInModelsRule } from './require-infer-attributes-in-models.js';

ruleTester.run('require-infer-attributes-in-models', requireInferAttributesInModelsRule, {
  valid: [
    {
      code: `
        import { DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
        import { Model } from 'sequelize-typescript';
      `,
    },
    {
      code: `
        import {
          DataTypes,
          type InferAttributes,
          type InferCreationAttributes,
          Model
        } from 'sequelize';
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { DataTypes } from 'sequelize';
        import { Model } from 'sequelize-typescript';
      `,
      errors: [
        {
          messageId: 'missingInferAttributesInModel',
        },
      ],
    },
    {
      code: `
        import { DataTypes, InferAttributes } from 'sequelize';
        import { Model } from 'sequelize-typescript';
      `,
      errors: [
        {
          messageId: 'missingInferAttributesInModel',
        },
      ],
    },
    {
      code: `
        import { DataTypes, InferCreationAttributes } from 'sequelize';
        import { Model } from 'sequelize-typescript';
      `,
      errors: [
        {
          messageId: 'missingInferAttributesInModel',
        },
      ],
    },
  ],
});