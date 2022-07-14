import path from 'path'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve' // 引入依赖包
import json from '@rollup/plugin-json'
// import dts from 'rollup-plugin-dts' // 生成组件库.d.ts文件，不过tsconfig配置 暂时用不到
import { terser } from 'rollup-plugin-terser'
const resolveFile = name => path.resolve(__dirname, name)
const extensions = ['.js', '.ts', '.tsx']
module.exports = [
	{
		input: './src/index.ts',
		plugins: [
			json(),
			typescript({
				check: false,
				tsconfig: resolveFile('./tsconfig.json'), // Local ts To configure
				extensions
			}),
			nodeResolve(),
			commonjs(),
			babel({
				babelHelpers: 'runtime',
				exclude: 'node_modules/**',
				plugins: ['@babel/plugin-transform-runtime']
			}),
			terser()
		],
		output: [
			{
				file: 'lib/index.js', // 通用模块
				format: 'umd',
				name: 'htmlTool'
			},
			{
				file: 'es/index.js', // es6模块
				format: 'es'
			}
		],
		globals: {
			ramda: 'ramda',
			axios: 'axios'
		},
		external: ['ramda', 'axios']
	}
]
