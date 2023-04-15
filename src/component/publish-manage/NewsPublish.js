import React from 'react';
import { Table, } from 'antd';

function index(Props) {
    const { dataSource } = Props;
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
                    {
                        Props.button(item.id)
                    }
                </div>
            }
        }
    ]
    return (
        <Table dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 5 }}
            rowKey={item => item.id} /> //pageSize设置每页显示的最大个数
    )
}

export default index