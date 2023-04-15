import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PageHeader, Card, Col, Row, List } from 'antd';
import _ from 'lodash'

function News() {
    const [dataSource, setDataSource] = useState([]);


    useEffect(() => {
        axios.get(`/news?publishState=2&_expand=category`).then(res => {
            console.log(res.data)
            console.log(Object.entries(_.groupBy(res.data, item => item.category.title)));
            setDataSource(Object.entries(_.groupBy(res.data, item => item.category.title)));
        })
    }, [])

    return (
        <div style={{
            width: '95%',
            margin: '0 auto'
        }}>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle='查看新闻'
            />
            <div className="site-card-wrapper">
                {/* gutter传入数组【16，16】表示每个col上下左右间隔都为16px，如果只是16则表示左右间隔16px */}
                <Row gutter={[16, 16]}>
                    {
                        dataSource.map(item =>
                            <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        bordered={false}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        dataSource={item[1]}   //列表中展示的数据
                                        renderItem={data => <List.Item> {<a href={`/detail/${data.id}`}>{data.title}</a>} </List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    )
}

export default News