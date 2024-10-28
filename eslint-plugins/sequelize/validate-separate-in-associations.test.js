import { ruleTester } from '../test/rule-tester.js';
import { validateSeparateInAssociationsRule } from './validate-separate-in-associations.js';

ruleTester.run('validate-separate-in-associations', validateSeparateInAssociationsRule, {
  valid: [
    // valid
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, separate: true }]
        })

        await UserModel.findAll({
          include: [{ model: ProfileModel, required: true }]
        })

        await UserModel.findAll({
          include: [{ model: ProfileModel, required: false, separate: true }]
        })
      `,
    },
    // ignored
    {
      code: `
        await UserModel.findAll({
          include: [{ required: true, separate: true }]
        })

        await UserModel.findAll({
          where: { model: ProfileModel, required: true, separate: true }
        })
      `,
    },
  ],
  invalid: [
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, required: true, separate: true }]
        })
      `,
      output: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, required: true, separate: false }]
        })
      `,
      errors: [
        {
          messageId: 'invalidSeparateInRequiredAssociation',
        },
      ],
    },
    {
      code: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, required: false }]
        })
      `,
      output: `
        await UserModel.findAll({
          include: [{ model: ProfileModel, required: false, separate: false }]
        })
      `,
      errors: [
        {
          messageId: 'missingSeparateInNonRequiredAssociation',
        },
      ],
    },
    // Test comma handling
    {
      code: `
        await UserModel.findAll({
          include: [{
            model: ProfileModel,
            required: false,
            where: {
              isExternal: true
            }
          }]
        })
      `,
      output: `
        await UserModel.findAll({
          include: [{
            model: ProfileModel,
            required: false,
            where: {
              isExternal: true
            }, separate: false
          }]
        })
      `,
      errors: [
        {
          messageId: 'missingSeparateInNonRequiredAssociation',
        },
      ],
    },
  ],
});
