import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Switch, Modal } from 'antd'
import axios from 'axios';
import UserForm from '../../../component/userform';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal;


export default function Userlist() {
  const [dataSource, setdataSource] = useState([]);
  const [visible, setvisible] = useState(false);
  const [updatavisible, setupdatavisible] = useState(false);
  const [updateDisabled, setupdateDisabled] = useState(false);
  const [current, setcurrent] = useState(null); //保存当前操作的item
  const [regions, setregions] = useState([]);
  const [roles, setroles] = useState([]);
  const addForm = useRef(null);
  const updataForm = useRef(null);
  const username = JSON.parse(localStorage.getItem('token'))[0].username;
  const roleId = JSON.parse(localStorage.getItem('token'))[0].id;
  const roleregion = JSON.parse(localStorage.getItem('token'))[0].region;
  const columns = [{
    title: '区域',
    dataIndex: 'region',
    key: '',
    render: (region) => {
      return <b>{region === '' ? '全球' : region}</b>;
    }, filters: [
      {
        text: '亚洲',
        value: '亚洲',
      },
      {
        text: '欧洲',
        value: '欧洲',
      }, {
        text: '北美洲',
        value: '北美洲',
      },
      {
        text: '南美洲',
        value: '南美洲',
      },
      {
        text: '非洲',
        value: '非洲',
      },
      {
        text: '大洋洲',
        value: '大洋洲',
      }, {
        text: '南极洲',
        value: '南极洲',
      }, {
        text: '全球',
        value: '',
      }
    ],
    onFilter: (value, item) => {
      return item.region === value;
    }
  }, {
    title: '角色名称',
    dataIndex: 'role',
    key: '',
    render: (role) => {
      return role?.roleName;
    }
  }, {
    title: '用户名',
    dataIndex: 'username',
    key: ''
  }, {
    title: '用户状态',
    dataIndex: 'roleState',
    key: '',
    render: (roleState, item) => {
      return <Switch checked={roleState} disabled={item.default} onChange={() => { change_roleState(item) }} ></Switch>  //一个对象的disabled属性设置为true后无法操作该对象
    }
  }, {
    title: '操作',
    key: '',
    render: (item) => { //不写dataIndex参数，item就是传入的对象，如果写了dataIndex则item指的就是dataIndex所指向的参数的数据
      return <div>
        <Button type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => { confirmMethod(item) }} disabled={item.default} danger />
        <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => { handleupdate(item) }} />
      </div>
    }
  }]

  const handleupdate = (item) => {
    setTimeout(() => {
      //每次点一下编辑框都会走一遍，所以不用担心 行代码会破坏逻辑
      setupdatavisible(true);
      if (item.roleId === 1) {
        setupdateDisabled(true);
      } else {
        setupdateDisabled(false);
      }
      updataForm.current.setFieldsValue(item)     //在当前组件中将要修改的对象的值填写到编辑框！！！（这里是添加用户和修改用户的区别）
    }, 0)
    setcurrent(item);
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
    setdataSource(dataSource.filter(data => item.id !== data.id));
    axios.delete(`/users/${item.id}`)
  }

  //添加信息
  const addFormok = () => {
    // 下面的方法可以获取到表单信息
    addForm.current.validateFields().then((value) => {
      setvisible(false);
      //点击确定后将表单数据清空
      addForm.current.resetFields();
      axios.post("/users", {
        //JSON-SERVER会自动创建一个id
        ...value,
        "roleState": true,
        "default": false
      }).then((res) => {
        setdataSource([...dataSource, {
          ...res.data,
          // 添加role对象，使其角色名称可以在添加完之后不刷新显示出来（按理来说应该是后台要完成的）
          "role": roles.filter((item) => {
            return (item.id === value.roleId)
          })[0]
        }])
      })
    }).catch((err) => {
      console.log()
    })
  }

  const change_roleState = (item) => {
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }

  const updataformok = () => {
    // 下面的方法可以获取到表单信息
    updataForm.current.validateFields().then((value) => {
      setupdatavisible(false);
      // console.log(value);
      setdataSource(dataSource.map((item) => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roles.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setupdateDisabled(!updateDisabled);//防止上一个状态影响下一个
      axios.patch(`/users/${current.id}`, {
        ...value
      })
    }).catch(err => console.log(err))
  }


  useEffect(() => {
    //级联向上一级查询?_expand=role
    axios.get('/users?_expand=role').then((res) => {
      // console.log(res.data);
      setdataSource(roleId === 1 ? res.data : [    //过滤
        ...res.data.filter(item => item.username === username),
        ...res.data.filter(item => item.roleId === 3 && item.region === roleregion)
      ])
    }, (err) => {
      console.log(err);
    })
  }, [roleId, roleregion, username])
  useEffect(() => {
    //获取区域集合
    axios.get('/regions').then((res) => {
      setregions(res.data)
    }, (err) => {
      console.log(err);
    })
  }, [])
  useEffect(() => {
    //获取管理员类别集合
    axios.get('/roles').then((res) => {
      setroles(res.data)
    }, (err) => {
      console.log(err);
    })
  }, [])

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setvisible(true);
        }}
      >
        添加用户
      </Button>
      <Table dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={item => item.id}>
      </Table>
      <Modal
        visible={visible}
        title="创建用户"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setvisible(false);
        }}
        onOk={() => {
          addFormok();
        }}
      >
        <UserForm roles={roles} regions={regions} ref={addForm}></UserForm>
      </Modal>

      <Modal
        visible={updatavisible}
        title="修改用户信息"
        okText="确认"
        cancelText="取消"
        onCancel={() => {
          setupdatavisible(false);
          setupdateDisabled(!updateDisabled); //防止上一个状态影响下一个
        }}
        onOk={() => {
          updataformok();
        }}>
        {/* 这里实现了userForm组件的复用 */}
        <UserForm roles={roles} regions={regions} updateDisabled={updateDisabled} ref={updataForm} isupdate={"true"}></UserForm>
      </Modal>
    </div >
  )
}
