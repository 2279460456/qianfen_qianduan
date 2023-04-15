import React, { useState, useEffect } from 'react';
import { Table, Button, notification } from 'antd';
import axios from 'axios';

function Audit() {
  const [dataSource, setDataSource] = useState();
  let { username, roleId, region } = JSON.parse(localStorage.getItem('token'))[0];

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: '',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: '',
      render: (title) => {
        return <>{title}</>
      }
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: '',
      render: (category) => {
        return < >{category.title}</>
      }
    }, {
      title: '操作',
      key: '',
      render: (item) => { //不写dataIndex参数，item就是传入的对象，如果写了dataIndex则item指的就是dataIndex所指向的参数的数据
        return <div>
          <Button type={"primary"} onClick={() => { handleAudit(item, 2, 1) }} >提交</ Button>
          <Button type={"primary"} onClick={() => { handleAudit(item, 3, 0) }} danger >驳回</ Button>
        </div >
      }
    }
  ]

  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(value => value.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: `提示`,
        description:
          '请前往【审核管理/审核列表】中查看审核状态',
        placement: 'bottomRight',
      });
    })
  }
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      // console.log(res.data);
      // setDataSource(res.data);
      setDataSource(roleId === 1 ? res.data : [
        ...res.data.filter(item => item.author === username),
        ...res.data.filter(item => item.roleId === 3 && item.region === region)
      ])
    })
  }, [roleId, username, region])
  return (

    <Table dataSource={dataSource}
      columns={columns}
      pagination={{ pageSize: 5 }}
      rowKey={item => item.id} /> //pageSize设置每页显示的最大个数
  )
}

export default Audit