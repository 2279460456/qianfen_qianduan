import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import axios from 'axios';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function Rightlist() {
  const [dataSource, setDataSource] = useState()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: '',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: '',
      render: (title) => {
        return <>{title}</>
      }
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: '',
      render: (key) => {
        return <Tag color="lime">{key}</Tag>
      }
    }, {
      title: '操作',
      key: '',
      render: (item) => { //不写dataIndex参数，item就是传入的对象，如果写了dataIndex则item指的就是dataIndex所指向的参数的数据
        return <div>
          <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => { confirmMethod(item) }} danger />
          <Popover content={<div style={{ textAlign: 'center' }}>  <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}> </Switch></div>}
            title='页面配置项'
            trigger={item.pagepermisson === undefined ? '' : 'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
          </Popover>
        </div>
      }
    }
  ]

  //权限列表开关选项操作
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, { pagepermisson: item.pagepermisson })
    } else {
      axios.patch(`/children/${item.id}`, { pagepermisson: item.pagepermisson })
    }
  }
  //弹出确认删除框
  const confirmMethod = (item) => {
    confirm({
      title: '确认删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: `${item.title}`,
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  //删除操作
  const deleteMethod = (item) => {
    // console.log(item);
    if (item.grade === 1) { //删除权限列表中的第一级
      setDataSource(dataSource.filter(data => data.id !== item.id));
      axios.delete(`/rights/${item.id}`)
    } else {  //删除权限列表中的第二级
      const list = dataSource.filter(data => data.id === item.rightId);
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setDataSource([...dataSource]) //datasSource第一层没有改变（第二层改变了），如果写 setDataSource(dataSource)，则differ算法默认该变量没有改变
      axios.delete(`/children/${item.id}`)
    }
  }

  useEffect(() => {
    //请求权限列表数据
    axios.get('/rights?_embed=children').then((res) => {
      res.data.forEach((item) => item.children?.length === 0 ? item.children = "" : item.children); //去掉首页前面的加号
      setDataSource(res.data)
    }, (err) => {
      console.log(err);
    })
  }, [])

  return (
    <Table dataSource={dataSource}
      columns={columns}
      pagination={{ pageSize: 5 }}
      rowKey={item => item.id} /> //pageSize设置每页显示的最大个数
  )
}
