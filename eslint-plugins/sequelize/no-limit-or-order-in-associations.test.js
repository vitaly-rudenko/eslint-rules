import { noLimitOrOrderInAssociationsRule } from './no-limit-or-order-in-associations.js';
import { ruleTester } from '../rule-tester.js';

ruleTester.run('no-limit-or-order-in-associations', noLimitOrOrderInAssociationsRule, {
  valid: [
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel }]
        })
      `,
    },
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel }],
          limit: 100,
          order: [['createdAt', 'DESC']]
        })
      `,
    },
  ],
  invalid: [
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, limit: 100 }]
        })
      `,
      errors: [
        {
          messageId: 'noLimitOrOrderInAssociation',
        },
      ],
    },
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, order: [['createdAt', 'DESC']] }]
        })
      `,
      errors: [
        {
          messageId: 'noLimitOrOrderInAssociation',
        },
      ],
    },
  ],
});
