module.exports = {
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    extends: [
        'airbnb-base',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings'
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'eol-last': ['error', 'always'],
        'class-methods-use-this': 0,
        'curly': ['error', 'all'],
        'no-confusing-arrow': ['error', {'allowParens': true}],
        'quotes': [
            'error',
            'single',
            {'avoidEscape': true, 'allowTemplateLiterals': false}
        ],
        'no-underscore-dangle': 0,
        'linebreak-style': 0,
        'import/no-named-as-default': 0,
        'import/prefer-default-export': 'off',
        'import/no-cycle': 'off',
        'no-param-reassign': ['error', {'props': false}],
        'sort-imports': ['error', {
            'ignoreCase': false,
            'ignoreDeclarationSort': true,
            'ignoreMemberSort': false,
            'memberSyntaxSortOrder': ['none', 'all', 'single', 'multiple']
        }],
        'no-use-before-define': 0
    },
    settings: {
        "react": {
            "createClass": "createReactClass",
            "pragma": "React",
            "version": "16.8.6"
        }
    }
};
