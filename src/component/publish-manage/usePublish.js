import { useEffect, useState } from 'react';
import axios from 'axios';
import { notification, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

function usePublish(type) {  //自定义hooks
    const { username } = JSON.parse(localStorage.getItem("token"))[0];
    const [dataSource, setDataSource] = useState();

    const handlePublish = (id) => {
        // console.log(id);
        setDataSource(dataSource.filter(item => item.id !== id));

        axios.patch(`/news/${id}`, {
            "publishState": 2,
        }).then(res => {
            // console.log(res.data);
            notification.info({
                message: `提示`,
                description:
                    '请前往【发布管理/已发布】中查看审核状态',
                placement: 'bottomRight',
            });
        })
    }
    const handleSunset = (id) => {
        // console.log(id);
        setDataSource(dataSource.filter(item => item.id !== id));

        axios.patch(`/news/${id}`, {
            "publishState": 3,
        }).then(res => {
            // console.log(res.data);
            notification.info({
                message: `提示`,
                description:
                    '请前往【发布管理/已下线】中查看审核状态',
                placement: 'bottomRight',
            });
        })
    }
    const handleDelete = (id) => {
        confirm({
            title: '确认删除吗?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // console.log(id);
                setDataSource(dataSource.filter(item => item.id !== id));

                axios.delete(`/news/${id}`).then(res => {
                    // console.log(res.data);
                    notification.info({
                        message: `提示`,
                        description:
                            '新闻已删除',
                        placement: 'bottomRight',
                    });
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }

    useEffect(() => { //请求数据
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            // console.log(res.data);
            setDataSource(res.data)
        })
    }, [username, type])
    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete,
    };
}

export default usePublish