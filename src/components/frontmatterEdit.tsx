import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import {
  Button,
  Select,
  DatePicker,
  DatePickerProps,
  Switch,
  Input,
  Divider
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { stringify } from 'gray-matter'
interface FrontmatterEditProps {
  markdownAttributes: Record<string, any>
  style?: CSSProperties
}

interface SelectedType {
  type: 'title' | 'isOriginal' | 'date' | 'category' | 'tag' | 'star' | ''
  value: string | boolean | Array<any> | Dayjs
}

const frontmatterTypeList: {label: string, value: SelectedType['type']}[] = [
  { value: 'title', label: '标题' },
  { value: 'isOriginal', label: '原创' },
  { value: 'date', label: '写作时间' },
  { value: 'category', label: '分类' },
  { value: 'tag', label: '标签' },
  { value: 'star', label: '是否收藏' },
]

function frontmatterEdit({ markdownAttributes, style }: FrontmatterEditProps) {
  const [selectedTypeList, setSelectedTypeList] = useState<SelectedType[]>([])

  const filterDisabledFrontmatterType = (type: SelectedType['type']) => {
    return selectedTypeList.map((item) => item.type).includes(type)
  }

  const setSelectedType = <T extends SelectedType, K extends keyof T>(
    index: number,
    attr: K,
    value: T[K]
  ) => {
    const newSelectedTypeList = [...selectedTypeList]
    newSelectedTypeList[index] = {
      ...newSelectedTypeList[index],
      [attr]: value,
    }
    setSelectedTypeList(newSelectedTypeList)
  }

  // TODO NAME
  const getStringify = () => {
    const data: any = {}
    selectedTypeList.forEach(({ type, value }) => {
      data[type] =
        type === 'date'
          ? dayjs(value as Dayjs).format('YYYY-MM-DD HH:mm:ss Z')
          : value
    })
    return stringify('', data)
  }

  useEffect(() => {
    setSelectedTypeList(
      Object.entries(markdownAttributes).map(([key, value]) => {
        if (key === 'date') value = dayjs(value)
        return {
          type: key as SelectedType['type'],
          value,
        }
      })
    )
  }, [markdownAttributes])

  const getValueComponent = (index: number, { type, value }: SelectedType) => {
    let component = null
    switch (type) {
      case 'date':
        const onOk = (value: DatePickerProps['value']) => {
          setSelectedType(index, 'value', value || '')
        }
        component = (
          <DatePicker
            showTime
            defaultValue={value as Dayjs}
            value={value as Dayjs}
            onOk={onOk}
          />
        )
        break
      case 'category':
      case 'tag':
        component = (
          // TODO options 整理
          <Select
            className="w-[400px]"
            mode="multiple"
            options={[]}
            defaultValue={value as any[]}
            value={value as any[]}
            onSelect={(value) => setSelectedType(index, 'value', value)}
          />
        )
        break
      case 'star':
      case 'isOriginal':
        component = (
          <Switch
            defaultChecked={value as boolean}
            checked={value as boolean}
            onChange={(value) => setSelectedType(index, 'value', value)}
          />
          )
        break
      case 'title':
        component = (
          <Input
            className="w-[400px]"
            defaultValue={value as string}
            value={value as string}
            onChange={(e) => setSelectedType(index, 'value', e.target.value)}
          />
        )
        break
    }
    return component
  }

  const handleAddItem = () => {
    setSelectedTypeList([...selectedTypeList, {
      type: '',
      value: ''
    }])
  }

  const handleDeleteItem = (index: number) => {
    const newSelectedTypeList = [...selectedTypeList]
    newSelectedTypeList.splice(index, 1)
    setSelectedTypeList(newSelectedTypeList)
  }

  return (
    <section className="flex-row px-2" style={style}>
      {selectedTypeList.map((item, index) => (
        <section key={index} className="mb-2 flex items-center gap-2">
          <Select
            className="w-[120px]"
            options={frontmatterTypeList.map((item) => ({
              ...item,
              disabled: filterDisabledFrontmatterType(item.value)
            }))}
            defaultValue={item.type}
            value={item.type}
            onSelect={(value) => setSelectedType(index, 'type', value)}
          />
          {getValueComponent(index, item)}
          <DeleteOutlined className="cursor-pointer" onClick={() => handleDeleteItem(index)} />
        </section>
      ))}
      {Object.keys(markdownAttributes).length !== 0 && (
        <Button onClick={handleAddItem}>添加一项</Button>
      )}
      <Divider />
      <p style={{ whiteSpace: 'pre-line' }}>{getStringify()}</p>
    </section>
  )
}

export default frontmatterEdit
