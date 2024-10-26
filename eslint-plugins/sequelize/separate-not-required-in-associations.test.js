import { ruleTester } from '../rule-tester.js';
import { separateNotRequiredInAssociationsRule } from './separate-not-required-in-associations.js';

ruleTester.run('separate-not-required-in-associations', separateNotRequiredInAssociationsRule, {
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
          messageId: 'separateNotRequiredInAssociation',
        },
      ],
    },
  ],
});
