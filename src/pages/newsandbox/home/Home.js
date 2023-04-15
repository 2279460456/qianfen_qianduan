import React, { useState, useEffect, useRef } from 'react';
import { Card, Col, Row, Avatar, List, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';      //可视化库
import _ from 'lodash'
import axios from 'axios';

const { Meta } = Card;

export default function Home() {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [ownnewsList, setOwnnewsList] = useState([]);
    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))[0];
    const [piechart, setPiechart] = useState(null);
    const barref = useRef();
    const pieref = useRef();
    const [visible, setVisible] = useState(false);

    const renderBarView = (obj) => {
        let myChart = echarts.init(barref.current);   // 基于准备好的dom，初始化echarts实例
        let option = {  // 指定图表的配置项和数据
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: '45',  //显示不下时，倾斜显示
                    interval: 0 //强制显示
                }
            },
            yAxis: {
                minInterval: 1    //最小间隔为一
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };
        myChart.setOption(option); // 使用刚指定的配置项和数据显示图表。
        window.onresize = () => {
            // console.log('resize change');
            myChart.resize();  //echarts自带方法当窗口大小改变时，同时改变试图大小
        }
    }

    const renderPieView = () => {
        // console.log(ownnewsList);
        let List = [];
        for (let newsname in ownnewsList) {
            List.push({
                value: ownnewsList[newsname].length,
                name: newsname,
            })
        }
        let myChart
        if (!piechart) {
            myChart = echarts.init(pieref.current);         //设置一个状态保持要操作的ref，如果多次不加判断语句，就会警告多次重新赋值dom
            setPiechart(myChart);
        } else {
            myChart = piechart;

        }
        let option;


        option = {
            title: {
                text: '当前用户新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: List,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

    useEffect(() => {     //去柱状图信息
        axios.get('/news?publishState=2&_expand=category').then(res => {
            // console.log(res.data);
            // console.log(_.groupBy(res.data, item => item.category.title));
            let bar = _.groupBy(res.data, item => item.category.title)
            renderBarView(bar)
        })

        return () => {   //组件卸载时执行
            window.onresize = null;
        }
    }, [])

    useEffect(() => {     //去饼状图图信息
        axios.get(`/news?publishState=2&_expand=category&author=${username}`).then(res => {
            // console.log(res.data);
            // console.log(_.groupBy(res.data, item => item.category.title));
            let pie = _.groupBy(res.data, item => item.category.title);
            setOwnnewsList(pie);
        })
    }, [username])

    useEffect(() => {   //取最多浏览
        axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=7`).then(res => {    //_sort为对view排序，_order为反向排序，_limit为取排序前六个
            setViewList(res.data);
            // console.log(res.data);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {   //取最多点赞
        axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=7`).then(res => {    //_sort为对view排序，_order为反向排序，_limit为取排序前六个
            setStarList(res.data);
            // console.log(res.data);
        }).catch(err => {
            console.log(err);
        })
    }, [])

    return (
        <div>
            <div className="site-card-wrapper">
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="用户最多浏览" bordered={true}>
                            <List
                                size="small"
                                // header={<div>Header</div>}
                                // footer={<div>Footer</div>}
                                bordered={false}
                                dataSource={viewList}   //列表中展示的数据
                                renderItem={item => <List.Item>{<a href={`/news-manage/preview/${item.id}`}>{item.title}</a>}</List.Item>}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="用户最多点赞" bordered={true}>
                            <List
                                size="small"
                                // header={<div>Header</div>}
                                // footer={<div>Footer</div>}
                                bordered={false}
                                dataSource={starList}
                                renderItem={item => <List.Item>{<a href={`/news-manage/preview/${item.id}`}>{item.title}</a>}</List.Item>}
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            cover={
                                <img
                                    alt="example"
                                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                />
                            }
                            actions={[
                                <SettingOutlined key="setting" onClick={() => {
                                    setTimeout(() => {
                                        setVisible(true);   //第一次setVisible之后状态变为true才会创建dom，所以第一次会报错（应该把他们放在异步里）
                                        renderPieView();
                                    }, 0)
                                }} />,
                                <EditOutlined key="edit" />,
                                <EllipsisOutlined key="ellipsis" />,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title={username}
                                description={
                                    <div>
                                        <b>{region ? region : '全球'}</b>
                                        <span style={{ padding: '10px' }}>{roleName}</span>
                                    </div>
                                }
                            />
                        </Card>
                    </Col>
                </Row>
            </div>


            <Drawer width='600px'
                title="Basic Drawer"
                placement="right"
                onClose={() => { setVisible(false); }}
                visible={visible} >
                <div ref={pieref} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
            </Drawer>


            <div ref={barref} style={{ width: '100%', height: '400px', marginTop: '30px' }}></div>
        </div >
    )
}
