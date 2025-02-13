import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { sharedJsRules, sharedTsRules } from '../../eslint.config.js'

export default tseslint.config(
  { ignores: ['dist', 'coverage/'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked],
    // Set the react version
    settings: { react: { version: '18.3' } },
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...sharedJsRules,
      ...sharedTsRules,
    },
  },
)
