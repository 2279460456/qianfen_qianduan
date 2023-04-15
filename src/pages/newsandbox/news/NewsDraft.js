import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, ToTopOutlined } from '@ant-design/icons';
const { confirm } = Modal;

function NewsDraft() {
  const [dataSource, setDataSource] = useState();
  const { username } = JSON.parse(localStorage.getItem('token'))[0];
  const navigate = useNavigate();

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
      render: (author) => {
        return < >{author}</>
      }
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: '',
      render: (category) => {
        return < >{category.title}</>
      }
    },
    {
      title: '操作',
      key: '',
      render: (item) => { //不写dataIndex参数，item就是传入的对象，如果写了dataIndex则item指的就是dataIndex所指向的参数的数据
        return <div>
          <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => { confirmMethod(item) }} danger />
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => { navigate(`/news-manage/update/${item.id}`) }} />
          <Button type="primary" shape="circle" icon={<ToTopOutlined />} onClick={() => { handleCheck(item, 'bottomRight') }} />
        </div>
      }
    }
  ]

  //权限列表开关选项操作
  // const switchMethod = (item) => {
  //   item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
  //   setDataSource([...dataSource])
  //   if (item.grade === 1) {
  //     axios.patch(`/rights/${item.id}`, { pagepermisson: item.pagepermisson })
  //   } else {
  //     axios.patch(`/children/${item.id}`, { pagepermisson: item.pagepermisson })
  //   }
  // }

  // 弹出确认删除框
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
    setDataSource(dataSource.filter(data => data.id !== item.id));
    axios.delete(`/news/${item.id}`);
  }

  const handleCheck = (item, placement) => {   //提交审核
    axios.patch(`/news/${item.id}`, {
      "auditState": 1,
    }).then(res => {
      notification.info({
        message: `提示`,
        description: '请前往审核页审核',
        placement,
      });
    })
  }

  useEffect(() => {  //检索auditState数据为0的，所以提交审核以后就不会再草稿箱中显示出来了
    axios.get(`/news?auditState=0&author=${username}&_expand=category`).then((res) => {
      setDataSource(res.data)
    }, (err) => {
      console.log(err);
    })
  }, [username])

  return (
    <Table dataSource={dataSource}
      columns={columns}
      pagination={{ pageSize: 5 }}
      rowKey={item => item.id} /> //pageSize设置每页显示的最大个数
  )
}

export default NewsDraft