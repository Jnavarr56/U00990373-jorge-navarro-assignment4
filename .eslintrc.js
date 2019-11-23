module.exports = {
	parser: 'babel-eslint',
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'prettier',
		'prettier/react'
	],
	plugins: ['react', 'react-hooks', 'json'],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	},
	rules: {
		'comma-dangle': ['warn', 'never'],
		'object-curly-spacing': ['warn', 'always'],
		'array-bracket-spacing': ['warn', 'always'],
		'comma-spacing': ['warn', { before: false, after: true }],
		'space-in-parens': ['warn', 'never'],
		'array-element-newline': ['warn', 'consistent'],
		'object-curly-newline': ['warn', { consistent: true }],
		'no-unused-vars': ['off'],
		'no-unused-vars': ['off'],
		'react/display-name': ['warn'],
		'react/prop-types': ['warn'],
		'react/sort-prop-types': ['warn'],
		'react/forbid-prop-types': ['warn'],
		'react/jsx-boolean-value': ['warn', 'never'],
		'react/jsx-first-prop-new-line': ['warn', 'multiline-multiprop'],
		'react/jsx-closing-bracket-location': ['warn', 'tag-aligned'],
		'react/jsx-curly-newline': ['warn', { multiline: 'consistent' }],
		'react/jsx-curly-spacing': ['warn', { when: 'never' }],
		'react/jsx-indent-props': ['warn', 'tab'],
		'react/jsx-max-props-per-line': [
			'warn',
			{
				maximum: 1,
				when: 'always'
			}
		],
		'react/jsx-equals-spacing': ['warn', 'never'],
		'react/jsx-no-duplicate-props': ['warn'],
		// 'react/jsx-no-useless-fragment': ['warn'],
		'react/jsx-tag-spacing': [
			'warn',
			{
				beforeSelfClosing: 'always'
			}
		],
		'react/jsx-sort-props': [
			'warn',
			{
				ignoreCase: true,
				callbacksLast: true
			}
		],
		'react/jsx-wrap-multilines': [
			'warn',
			{
				declaration: 'parens-new-line',
				assignment: 'parens-new-line',
				return: 'parens-new-line',
				arrow: 'parens-new-line',
				condition: 'ignore',
				logical: 'ignore',
				prop: 'ignore'
			}
		],
		'react/jsx-indent-props': ['warn', 'tab'],
		'react/jsx-indent': ['warn', 'tab'],
		'react/jsx-curly-brace-presence': ['warn', 'never'],
		'react/jsx-sort-default-props': [
			'warn',
			{
				ignoreCase: false
			}
		],
		'react/jsx-no-undef': ['warn'],
		'react/jsx-no-literals': ['off'],
		'react/jsx-uses-react': ['warn'],
		'react/jsx-uses-vars': ['warn'],
		'react/no-danger': ['warn'],
		'react/no-did-mount-set-state': ['off'],
		'react/no-did-update-set-state': ['warn'],
		'react/no-direct-mutation-state': ['warn'],
		'react/no-multi-comp': ['warn'],
		'react/no-set-state': ['warn'],
		'react/no-unknown-property': ['warn'],
		'react/prefer-es6-class': ['warn'],
		'react/react-in-jsx-scope': ['warn'],
		'react/self-closing-comp': ['warn'],
		'react/sort-comp': ['off'],
		'react-hooks/exhaustive-deps': ['warn'],
		'react/no-unescaped-entities': ['warn']
	},
	env: {
		browser: true,
		node: true,
		es6: true
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
}
