import { ruleTester } from '../test/rule-tester.js';
import { validateThroughAssociationsRule } from './validate-through-associations.js';

ruleTester.run('validate-through-associations', validateThroughAssociationsRule, {
  valid: [
    {
      code: `
        User.findAll({
          attributes: ['name'],
          include: [{
            model: File,
            through: {
              as: 'taggedFiles',
              attributes: ['id'],
            },
          }]
        })
      `,
    },
  ],
  invalid: [
    {
      code: `
        User.findAll({
          attributes: ['name'],
          include: [{
            model: File,
            through: {
              attributes: ['id'],
            },
          }]
        })
      `,
      errors: [
        {
          messageId: 'requireThroughAs',
        },
      ],
    },
    {
      code: `
        User.findAll({
          attributes: ['name'],
          include: [{
            model: File,
            through: {
              as: 'taggedFiles',
            },
          }]
        })
      `,
      errors: [
        {
          messageId: 'requireThroughAttributes',
        },
      ],
    },
    {
      code: `
        User.findAll({
          attributes: ['name'],
          include: [{
            model: File,
            through: {
              as: 'taggedFiles',
              attributes: [],
            },
          }]
        })
      `,
      errors: [
        {
          messageId: 'requireThroughAttributesNotEmpty',
        },
      ],
    },
  ],
});
