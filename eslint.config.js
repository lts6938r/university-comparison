// eslint.config.js
import js from '@eslint/js';
import vuePlugin from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

// 使用直接导入的浏览器和Node全局变量
const browserGlobals = {
  window: true,
  document: true,
  navigator: true,
  fetch: true,
  // 添加其他浏览器全局变量...
};

const nodeGlobals = {
  require: true,
  process: true,
  module: true,
  __dirname: true,
  // 添加其他Node全局变量...
};

export default [
  // 忽略文件配置
  {
    ignores: [
      'node_modules/',
      'dist/',
      '*.md',
      '*.json',
      '*.{svg,png,jpg,jpeg,gif,ico}'
    ]
  },
  
  // JavaScript 基础规则
  js.configs.recommended,
  
  // 全局变量配置
  {
    languageOptions: {
      globals: {
        ...browserGlobals,
        ...nodeGlobals
      }
    }
  },
  
  // TypeScript 配置
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },
  
  // Vue 配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: {
          ts: tsParser,
          js: js.parser
        },
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue: vuePlugin
    },
    rules: {
      ...vuePlugin.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 3
        },
        multiline: {
          max: 1
        }
      }],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': ['error', 2],
      'vue/script-indent': ['error', 2, {
        baseIndent: 1,
        switchCase: 1
      }]
    }
  },
  
  // 通用规则
  {
    rules: {
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', 'always'],
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    }
  }
];