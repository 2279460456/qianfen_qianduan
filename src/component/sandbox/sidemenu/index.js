import React, { useEffect, useState } from 'react'
import './index.css'; //引入样式
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'; //antd
import { HomeOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
const { Sider } = Layout;
const { SubMenu } = Menu;

const icons = {
  "/user-manage": <HomeOutlined />,
  "/user-manage/list": <HomeOutlined />
}

function SideMeau(Props) {

  let navigate = useNavigate(); //路由跳转
  let location = useLocation();
  let [menu, setMenu] = useState([]);
  const selectKeys = [location.pathname]; //获取当前路由
  const openKeys = ['/' + location.pathname.split('/')[1]];
  const date = JSON.parse(localStorage.getItem('token'))[0];
  useEffect(() => {
    axios.get("/rights?_embed=children").then(
      (res) => {
        // console.log(res.data);
        setMenu(res.data);
      },
      (err) => {
        console.log(err);
      }
    )
  }, [])

  const is_pagepermisson = (item) => {
    //根据用户权限动态显示自己的侧边栏
    return item.pagepermisson === 1 && date.role.rights.includes(item.key);
  }

  //渲染组件函数
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && is_pagepermisson(item)) {    //?.运算符只有item.children存在才会判断其是否有length属性
        return <SubMenu key={item.key} icon={icons[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      //渲染每一个侧边栏子项
      else if (is_pagepermisson(item)) {
        return <Menu.Item key={item.key} icon={icons[item.key]} onClick={() => { navigate(item.key) }}>
          {item.title}
        </Menu.Item>
      }
    })
  }

  return (
    //callapsible表示可折叠
    <Sider trigger={null} collapsible collapsed={Props.isCollapsed} >
      {/* 侧边栏项数展开以后如果超出屏幕最大高度,则出现滚动条 */}
      <div style={{ display: 'flex', height: '100%', "flexDirection": "column" }}>
        <div className="logo"  > 全球新闻发布导航系统 </ div>
        {/* 侧边栏项数展开以后如果超出屏幕最大高度,则出现滚动条 */}
        <div style={{ flex: 1, "overflow": "auto" }}>
         
          <Menu theme="dark" mode="inline" defaultOpenKeys={openKeys} defaultSelectedKeys={selectKeys}>
            {
              renderMenu(menu)  //动态渲染组件
            }
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({ CollapseReducer: { isCollapsed } }) => ({ a: 1, isCollapsed })

export default connect(mapStateToProps,)(SideMeau)