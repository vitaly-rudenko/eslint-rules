import { RuleTester } from 'eslint';
import { separateNotRequiredInAssociationsRule } from './separate-not-required-in-associations.js';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
  },
});

ruleTester.run('separate-not-required', separateNotRequiredInAssociationsRule, {
  valid: [
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, separate: true }]
        })
      `,
    },
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, required: true }]
        })
      `,
    },
    {
      code: `
        await instance.method({
          include: [{ required: true, separate: true }]
        })
      `,
    },
    {
      code: 'const object = { required: true, separate: true }',
    },
    {
      code: 'const include = [{ required: true, separate: true }]',
    },
  ],
  invalid: [
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, separate: true, required: true }]
        })
      `,
      errors: [
        {
          messageId: 'separateNotRequired',
        },
      ],
    },
  ],
});
