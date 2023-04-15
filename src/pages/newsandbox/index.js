import React, { useEffect } from 'react'
import NewRouter from '../../component/sandbox/NewRouter'
import Nprogress from 'nprogress'//进度条
import 'nprogress/nprogress.css'

//组件
import SideMeau from '../../component/sandbox/sidemenu';
import TopHeader from '../../component/sandbox/topheader'

//引入css样式
import './index.css'

//antd
import { Layout } from 'antd';
const { Content } = Layout;

export default function SandBox() {
    Nprogress.start();

    useEffect(() => {
        Nprogress.done();
    })

    return (
        <Layout>
            <SideMeau></SideMeau>
            <Layout className="site-layout">
                <TopHeader ></TopHeader>
                {/* overflow:auto使内容过多时不撑开主页内容，而是撑开content组件内容 */}
                <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280, overflow: 'auto' }}>
                    <NewRouter></NewRouter>
                </ Content>
            </ Layout >
        </ Layout >
    )
}
