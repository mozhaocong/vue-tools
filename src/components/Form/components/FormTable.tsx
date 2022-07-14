import { defineComponent, PropType } from 'vue'
import { Form, Table } from 'ant-design-vue'
import { isTrue } from '@ht/html-tool'
import RFormItem from './FormItem'
import { formItemConfig, formProps, formRulesName, setFormConfig } from '../util'

import { ColumnGroupType, ColumnType } from 'ant-design-vue/lib/table/interface'
interface formTableColumns extends ColumnType<any> {
	row?: FormRowArray
}
interface formTableColumnsGroup extends ColumnGroupType<any> {
	row?: FormRowArray
}

type formTableColumnsType = (formTableColumns | formTableColumnsGroup)[]

const Props = {
	model: {
		type: Array as PropType<any[]>,
		required: true,
	},
	columns: {
		type: Array as PropType<formTableColumnsType>,
		required: true,
	},
	rowKey: Array as PropType<any[]>,
	pagination: {
		type: Boolean as PropType<boolean>,
		default: false,
	},
	...formProps,
} as const
export default defineComponent({
	props: Props,
	setup(props, { slots }) {
		return () => {
			const columnsList = props.columns.map((item: any) => {
				const data: ObjectMap = {}
				if (!item.customRender && isTrue(item.row)) {
					data.customRender = ({ record, index }: any) => {
						const listRows = item.row.map((res: any) => {
							return {
								colProps: { span: 24 },
								formItemProps: {
									wrapperCol: { span: 24 },
									labelCol: { span: 0 },
								},
								...res,
								name: formRulesName(props, res, index),
							}
						})
						return <RFormItem model={record} rows={listRows} v-slots={slots} {...formItemConfig(props)} />
					}
				}
				return { ...item, ...data }
			})
			const table = <Table pagination={props.pagination as any} dataSource={props.model} columns={columnsList} />
			return !isTrue(props.rowKey) ? (
				<Form model={props.model} {...setFormConfig(props)}>
					{table}
				</Form>
			) : (
				table
			)
		}
	},
})
