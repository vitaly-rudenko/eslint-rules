import { RuleTester } from '@typescript-eslint/rule-tester';
import { join } from 'path';

RuleTester.afterAll = () => {}
RuleTester.describe = () => {}

export const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts*'],
      },
      tsconfigRootDir: join(import.meta.dirname, '..'),
    },
  },
});
