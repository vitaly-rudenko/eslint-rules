import { ruleTester } from '../test/rule-tester.js';
import { requireRequiredInAssociationsRule } from './require-required-in-associations.js';

ruleTester.run('require-required-in-associations', requireRequiredInAssociationsRule, {
  valid: [
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, required: true }]
        })

        await UserModel.findAll({
          include: [{ model: ProfileModel, required: false }]
        })
      `,
    },
    {
      code: `
        await UserModel.findOne({
          include: [{ model: ProfileModel, required: true }]
        })

        await UserModel.findOne({
          include: [{ model: ProfileModel, required: false }]
        })
      `,
    },
  ],
  invalid: [
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel }]
        })
      `,
      errors: [
        {
          messageId: 'requireRequiredInAssociation',
        },
      ],
    },
    {
      code: `
        await UserModel.findOne({
          include: [{ model: ProfileModel, where: { id: 'test' } }]
        })
      `,
      errors: [
        {
          messageId: 'requireRequiredInAssociation',
        },
      ],
    },
    {
      code: `
        await UserModel.findAll({
          include: [{
            model: ProfileModel
          }]
        })
      `,
      errors: [
        {
          messageId: 'requireRequiredInAssociation',
        },
      ],
    },
    {
      code: `
        await UserModel.findOne({
          include: [{
            model: ProfileModel,
            where: { id: 'test' }
          }]
        })
      `,
      errors: [
        {
          messageId: 'requireRequiredInAssociation',
        },
      ],
    },
  ],
});
