import { ruleTester } from '../test/rule-tester.js';
import { requireLimitInFindAllRule } from './require-limit-in-find-all.js';

ruleTester.run('require-limit-in-find-all', requireLimitInFindAllRule, {
  valid: [
    {
      code: `
        User.findAll({
          attributes: ['name'],
          include: [{ model: Profile, attributes: ['email'] }],
          limit: 100
        })
      `,
    },
  ],
  invalid: [
    {
      code: `
        User.findAll({
          attributes: ['name'],
          include: [{ model: Profile, attributes: ['email'] }]
        })
      `,
      errors: [
        {
          messageId: 'requireLimitInFindAll',
        },
      ],
    },
  ],
});
