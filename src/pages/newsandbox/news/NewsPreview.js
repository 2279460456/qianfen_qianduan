import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader, Descriptions } from 'antd';
import axios from 'axios';
import moment from "moment";

function Newspreview(Props) {
    const Parms = useParams();
    const [date, setDate] = useState(null);
    const auditList = ["未审核", "审核中", "已通过", "未通过"];
    const publishList = ["未发布", "待发布", "已上线", "已下线"];
    const colorList = ['blcak', 'orange', 'green', 'red'];

    useEffect(() => {
        // console.log(Parms.id);
        axios.get(`/news/${Parms.id}?_expand=role&_expand=category `).then(res => {
            setDate(res.data);
            // console.log(res.data);
        }).catch(err => { console.log(err); })
    }, [Parms.id])
    return (
        <div>
            < div className="site-page-header-ghost-wrapper" >
                {date && <PageHeader   //只有当请求到date数据才渲染页面，否则date为null，首次渲染时会报错
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={date.title}
                    subTitle={date.category.title}
                >
                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="创建者">{date.author}</Descriptions.Item>
                        <Descriptions.Item label="创建时间">{moment(date.createTime).format("YYYY/MM/DD HH:mm:ss")} </Descriptions.Item>
                        <Descriptions.Item label="发布时间">{date.publishTime ? moment(date.publishTime).format("YYYY/MM/DD HH:mm:ss") : '-'}</Descriptions.Item>
                        <Descriptions.Item label="区域">{date.region}</Descriptions.Item>
                        <Descriptions.Item label="审核状态" ><span style={{ color: colorList[date.auditState] }}>{auditList[date.auditState]} </span></Descriptions.Item>
                        <Descriptions.Item label="发布状态"><span style={{ color: colorList[date.publishState] }}>{publishList[date.publishState]}</span></Descriptions.Item>
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