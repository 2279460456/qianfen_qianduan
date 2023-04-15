import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Descriptions } from 'antd';
import { HeartTwoTone } from '@ant-design/icons'
import axios from 'axios';
import moment from "moment";

function Newspreview(Props) {
    const Parms = useParams();
    const [date, setDate] = useState();

    const handleStar = () => {  //点赞
        setDate({
            ...date,
            star: date.star + 1
        });
        axios.patch(`/news/${Parms.id}?`, {
            star: date.star + 1
        })

    }

    useEffect(() => {      //获取状态，并且当访问量增加时，改变状态
        // console.log(Parms.id);
        axios.get(`/news/${Parms.id}?_expand=role&_expand=category `).then(res => {
            // console.log(res.data);     
            setDate({
                ...res.data,
                view: res.data.view + 1
            });
            return res.data;       //将res.data 的值作为契约的值传给下一个契约 !!!
        }).then(res => {
            // console.log(res);
            axios.patch(`/news/${Parms.id}?_expand=role&_expand=category`, {
                view: res.view + 1
            })
        })
    }, [Parms.id])
    return (
        <div>
            < div className="site-page-header-ghost-wrapper" >
                {date && <PageHeader   //只有当请求到date数据才渲染页面，否则date为null，首次渲染时会报错
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={date.title}
                    subTitle={<div>
                        {date.category.title}
                        <HeartTwoTone style={{ margin: "0 0 0 10px" }} onClick={handleStar} />
                    </div>}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{date.author}</Descriptions.Item>
                        <Descriptions.Item label="发布时间">{date.publishTime ? moment(date.publishTime).format("YYYY/MM/DD HH:mm:ss") : '-'}</Descriptions.Item>
                        <Descriptions.Item label="区域">{date.region}</Descriptions.Item>
                        <Descriptions.Item label="访问数量">{date.view}</Descriptions.Item>
                        <Descriptions.Item label="点赞数量">{date.star}</Descriptions.Item>
                        <Descriptions.Item label="评论数量">{0}</Descriptions.Item>
                    </Descriptions>
                </PageHeader>}
            </ div >
            <div style={{
                border: "1px solid gray",
                margin: '10px 24px'
            }}
                dangerouslySetInnerHTML={{    //不安全
                    __html: date?.content
                }}>
            </div>
        </div>
    )
}

export default Newspreview