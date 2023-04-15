import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Tag, Button, notification } from 'antd';

function AuditList() {
    const { username } = JSON.parse(localStorage.getItem("token"))[0];
    const [dataSource, setDataSource] = useState();
    const navigate = useNavigate();

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
        },
        {
            title: '审核状态',
            dataIndex: 'auditState',
            key: '',
            render: (auditState) => {
                const colorList = ['', 'orange', 'green', 'red'];
                const auditList = ['草稿箱', '审核中', '已通过', '未通过'];
                return <Tag color={colorList[auditState]}> {auditList[auditState]}</ Tag>
            }
        }, {
            title: '操作',
            key: '',
            render: (item) => { //不写dataIndex参数，item就是传入的对象，如果写了dataIndex则item指的就是dataIndex所指向的参数的数据
                return <div>
                    <Button type={"primary"} style={{ display: item.auditState === 1 ? 'ture' : "none" }} onClick={() => { handleRerver(item) }} >{'撤销'}</ Button>
                    <Button type={"primary"} style={{ display: item.auditState === 2 ? 'ture' : "none" }} danger onClick={() => { handlePublish(item) }}>{'发布'}</ Button>
                    <Button type={"primary"} style={{ display: item.auditState === 3 ? 'ture' : "none" }} onClick={() => { hanldeUpdate(item) }} >{'更新'}</ Button>
                </div >
            }
        }
    ]
    const handleRerver = (item) => {
        setDataSource(dataSource.filter(value => value.id !== item.id));
        axios.patch(`/news/${item.id}`, {
            "auditState": 0,
        }).then(res => {
            notification.info({
                message: `提示`,
                description: '请前往草稿箱审核',
                placement: 'bottomRight',
            });
        })
    }

    const hanldeUpdate = (item) => {
        navigate(`/news-manage/update/${item.id}`)
    }
    const handlePublish = (item) => {
        axios.patch(`/news/${item.id}`, {
            "publishState": 2,
            "publishTime": Date.now(),
        }).then(res => {
            notification.info({
                message: `提示`,
                description: '请前往【发布管理/已发布】中审核',
                placement: 'bottomRight',
            });
        })
    }

    useEffect(() => { //_ne=0 (不等于0) _lte=1(小于等于1)
        axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        }).catch(err => { console.log(err); })
    }, [username])
    return (

        <Table dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowKey={item => item.id} /> //pageSize设置每页显示的最大个数
    )
}

export default AuditList