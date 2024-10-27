import { ruleTester } from '../test/rule-tester.js';
import { requireAttributesInQueriesRule } from './require-attributes-in-queries.js';

ruleTester.run('require-attributes-in-queries', requireAttributesInQueriesRule, {
  valid: [
    {
      code: `
        User.findAll({
          attributes: ['name'],
          include: [{ model: Profile, attributes: ['email'] }]
        })

        User.findOne({
          attributes: ['name'],
          include: [{ model: Profile, attributes: ['email'] }]
        })
      `,
    },
  ],
  invalid: [
    {
      code: `
        User.findAll({
          include: [{ model: Profile, attributes: ['email'] }]
        })
      `,
      errors: [
        {
          messageId: 'requireAttributesInFindMethod',
        },
      ],
    },
    {
      code: `
        User.findAll({
          attributes: ['name'],
          include: [{ model: Profile }]
        })
      `,
      errors: [
        {
          messageId: 'requireAttributesInAssociation',
        },
      ],
    },
    {
      code: `
        User.findOne({
          include: [{ model: Profile, attributes: ['email'] }]
        })
      `,
      errors: [
        {
          messageId: 'requireAttributesInFindMethod',
        },
      ],
    },
    {
      code: `
        User.findOne({
          attributes: ['name'],
          include: [{ model: Profile }]
        })
      `,
      errors: [
        {
          messageId: 'requireAttributesInAssociation',
        },
      ],
    },
  ],
});
