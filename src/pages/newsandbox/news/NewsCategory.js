import React, { useState, useEffect, useRef, useContext } from 'react';
import { Table, Button, Modal, Form, Input } from 'antd';
import { DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;
const EditableContext = React.createContext(null);

function NewsCategory() {
  const [dataSource, setDataSource] = useState();
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
      title: '栏目名称',
      dataIndex: 'title',
      key: '',
      onCell: (record) => ({  //可编辑项需要添加
        record,
        editable: true,   //是否可编辑
        dataIndex: "title",
        title: "栏目名称",
        handleSave: handleSave,
      }),
      render: (title, item) => {
        return < >{title}</>
      }
    },


    {
      title: '操作',
      key: '',
      render: (item) => { //不写dataIndex参数，item就是传入的对象，如果写了dataIndex则item指的就是dataIndex所指向的参数的数据
        return <div>
          <Button type="primary" shape="circle" icon={< DeleteFilled />} onClick={() => { confirmMethod(item) }} danger />
        </div>
      }
    }
  ]

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const components = {     //可编辑框渲染的行列
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const handleSave = (record) => {  //可编辑框点击后在失去焦点以后就会调用该函数
    // console.log(record);
    setDataSource(dataSource.map(item => {
      if (item.id === record.id) {
        return {
          "id": record.id,
          "title": record.title,
          "value": record.title,
        }
      } else {
        return item;
      }
    }))

    axios.patch(`categories/${record.id}`, {
      "id": record.id,
      "title": record.title,
      "value": record.title,
    }).then(res => {
      // console.log(res.data);
    })
  }

  const confirmMethod = (item) => {   // 弹出确认删除框
    confirm({
      title: '确认删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: `${item.title}`,
      onOk() {
        handleDelete(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const handleDelete = (item) => {  //删除操作
    setDataSource(dataSource.filter(value => value.id !== item.id));
    axios.delete(`/categories/${item.id}`).then(res => {
      // console.log(res.data);
    })
  }

  useEffect(() => {
    axios.get('/categories').then(res => {
      // console.log(res.data);
      setDataSource(res.data);
    })
  }, [])

  return (
    <div>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        pagination={{ pageSize: 6 }}
        rowKey={item => item.id}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  )
}

export default NewsCategory