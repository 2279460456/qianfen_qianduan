import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;

export default function Rolelist() {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentId, setcurrentId] = useState(0);
  const [rightList, setrightList] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const columns = [{
    title: 'ID',
    dataIndex: 'id',
    key: ''
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: ''
  },
  {
    title: '操作',
    key: '',
    render: (item) => { //不写dataIndex参数，item就是传入的对象，如果写了dataIndex则item指的就是dataIndex所指向的参数的数据
      return <div>
        <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => { confirmMethod(item) }} danger />
        <Button type="primary" shape="circle" icon={<UnorderedListOutlined />} onClick={() => {
          change_isModalVisible();
          setCheckedKeys(item.rights);
          setcurrentId(item.id);
        }} />
      </div>
    }
  }];

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
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    axios.delete(`/roles/${item.id}`)
  }

  const change_isModalVisible = () => {
    setIsModalVisible(true);
  }

  //修改树形结构中的某些项
  const handleOk = () => {
    // console.log(checkedKeys, currentId);
    setIsModalVisible(false);
    setDataSource(dataSource.map(item => {
      // console.log(item);
      // console.log(checkedKeys);
      if (item.id === currentId) {
        return {
          ...item,
          rights: checkedKeys
        }
      } else {
        return item;
      }
    }))
    axios.patch(`/roles/${currentId}`, { rights: checkedKeys })
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  }

  const oncheck = (checkedKeys) => {
    setCheckedKeys(checkedKeys.checked);
  }

  useEffect(() => {
    //获取角色信息
    axios.get('/roles/').then((res) => {
      setDataSource(res.data);
    },
      (err) => {
        console.log(err);
      })
    //获取rightList数据
    axios.get('/rights?_embed=children').then((res) => {
      setrightList(res.data);
    },
      (err) => {
        console.log(err);
      })
  }, [])

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id}></Table>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly={true}  //父子节点不关联
          onCheck={oncheck}
          treeData={rightList}
          checkedKeys={checkedKeys}
        />
      </Modal>
    </div>
  )
}
