import React from 'react'
import { Form, Input, Button, message } from 'antd';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.css'


export default function Login() {
    const navigate = useNavigate();

    const onFinish = (date) => {
        const { username, password } = date;
        axios.get(`/users?username=${username}&password=${password}&roleState=true&_expand=role`).then(
            res => { //判断是否存在该用户
                if (res.data.length === 0) {
                    message.error('用户不存在或密码不正确');
                } else {
                    // console.log(res.data);
                    localStorage.setItem("token", JSON.stringify(res.data));
                    navigate('/');
                }
            }, err => {
                console.log(err);
            }
        )
    }

    return (
        <div style={{ background: "rgb(35,39,65)", height: '100%' }}>
            <div className='formContainer'>
                <div className='logintitle'>全球新闻发布管理系统</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Username" autoComplete="off" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            autoComplete="off"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
