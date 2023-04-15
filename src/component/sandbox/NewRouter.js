import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Spin, } from 'antd';
import { connect } from 'react-redux';

//组件
import Home from '../../pages/newsandbox/home/Home'
import UserList from '../../pages/newsandbox/user-manage/UserList'
import RoleList from '../../pages/newsandbox/right-manage/RoleList/RoleList'
import RightList from '../../pages/newsandbox/right-manage/RightList/RightList'
import NewsAdd from '../../pages/newsandbox/news/NewsAdd'
import NewsDraft from '../../pages/newsandbox/news/NewsDraft'
import NewsPreview from '../../pages/newsandbox/news/NewsPreview';
import NewsUpdate from '../../pages/newsandbox/news/NewsUpdate'
import NewsCategory from '../../pages/newsandbox/news/NewsCategory'
import Audit from '../../pages/newsandbox/audit-manage/Audit'
import AuditList from '../../pages/newsandbox/audit-manage/AuditList'
import Unpublished from '../../pages/newsandbox/published/Unpublished'
import Published from '../../pages/newsandbox/published/Published'
import Sunset from '../../pages/newsandbox/published/Sunset'
import NotFound from '../notfound'
import axios from 'axios';


//路由映射表
const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />,
}
function NewRouter(Props) {

    const [backRouteList, setbackRouteList] = useState([]);
    const { rights: UserRoutes } = JSON.parse(localStorage.getItem('token'))[0].role;

    const checkRoute = (item) => { //检查本地映射表中是否有后台返回数据的那一项，并且检查该项是否需要展示出来
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson);
    }
    const checkUserPermission = (item) => { //判断当前登录用户所具备的权限列表
        return UserRoutes.includes(item.key);
    }

    useEffect(() => {
        Promise.all([axios.get(`/rights`),  //将查询到的数据扁平化
        axios.get(`/children`)]).then(
            res => {
                setbackRouteList([...res[0].data, ...res[1].data])
                console.log([...res[0].data, ...res[1].data]);
            }, err => {
                console.log(err);
            }
        )
    }, [])
    return (
        <div>
            <Spin size="large" spinning={Props.isLoading} >
                <Routes>
                    {
                        backRouteList.map(item => {
                            if (checkRoute(item) && checkUserPermission(item)) {
                                return <Route path={item.key} key={item.key}
                                    element={LocalRouterMap[item.key]}>
                                </Route>
                            } else {
                                return <Route path='/*' key={'/*'} element={<NotFound></NotFound>}></Route>
                            }
                        })
                    }
                    <Route path='/' element={<Navigate replace from='/' to='/home'></Navigate>} />
                    {/* 如果不加判断页面刚开始加载的时候因为backRouteList是空数组所以没有任何路由，就会走到/*渲染NotFound组件 */}
                    {
                        backRouteList.length > 0 && <Route path='/*' key={'/*'} element={<NotFound></NotFound>}></Route>
                    }
                </Routes>
            </ Spin>
        </div>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({ isLoading });

export default connect(mapStateToProps)(NewRouter);