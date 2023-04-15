import React, {  } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';   //连接到store
const { Header } = Layout;

function Topheader(Props) {
    const navigate = useNavigate();
    const { roleName } = JSON.parse(localStorage.getItem('token'))[0].role;
    const username = JSON.parse(localStorage.getItem('token'))[0].username;
    const changeCollapsed = () => {
        Props.changeCollapsed();
        // console.log(Props);
    }
    // console.log(Props.a, Props.isCollapsed);  //检验redux的值
    //退出登录
    const logout = () => {
        localStorage.removeItem('token'); //清除token
        navigate('/login');
    }

    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger onClick={() => {
                logout();
            }}>退出登录</Menu.Item>
        </Menu>
        // <Menu item={[
        //     {
        //         label: ({ roleName }),

        //     },
        //     {
        //         label: ("退出登录"),
        //         danger: true,
        //         onClick: () => {
        //             logout();
        //         }
        //     }
        // ]} />
    );
    return (
        <Header className="site-layout-background" style={{ padding: " 0 16px" }}>
            {/* {{
                React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: this.toggle,
                })
            }} */}
            {
                Props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : < MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: "right" }}>
                <span style={{ margin: "0 5px 0 0" }}>欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header >
    )
}

const mapStateToProps = ({ CollapseReducer: { isCollapsed } }) => ({ a: 1, isCollapsed }); //从store取值
const mapDispatchToProps = {
    changeCollapsed() {
        return {     //此对象作为action发送到对应的reducer
            type: "change_collapsed",  //type为必传参数    
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Topheader);