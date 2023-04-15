import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { PageHeader, Button, Form, Input, Select, message, notification } from 'antd';
import { Steps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import NewsEdtior from '../../../component/NewsEdtior'

const { Step } = Steps;
const { Option } = Select;

function NewsUpdate(Props) {
    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [formInfo, setFormInfo] = useState();
    const [content, setContent] = useState("");
    const NewsForm = useRef(null);
    const navigate = useNavigate();
    const Parms = useParams();

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const handlenext = () => {     //下一步
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {  //检测表单是否有内容，如果有数据会走第一个回调函数并且返回数据
                // console.log(res);
                setFormInfo(res);
                setCurrent(current + 1);
            }).catch(err => { console.log(err); }) //如果没有数据就会走catch
        } else {
            // console.log(content, formInfo);
            if (content === '' || content.trim() === '<p></p>') {
                message.error('新闻不能不为空！');
            } else {
                setCurrent(current + 1);
            }
        }
    };

    const handleprevious = () => {   //上一步
        setCurrent(current - 1);
    };

    const handleupdate = (auditState, placement) => {  //保存草稿箱或者提交
        axios.patch(`/news/${Parms.id}`, {
            "title": formInfo.title,
            "categoryId": formInfo.categoryId,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            // auditState === 0 ? navigate('/news-manage/draft') : navigate('/audit-manage/audit');
            // navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/audit')
            notification.info({
                message: `提示`,
                description:
                    auditState === 0 ? '请前往草稿箱查看' : '请前往审核页审核',
                placement,
            });
        })
    }

    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategoryList(res.data);
        }, err => {
            console.log(err);
        })
    }, [])

    useEffect(() => {   //更新用户信息时，将从后台取回的数据填入到对应的内容框中
        // console.log(Parms.id);
        axios.get(`/news/${Parms.id}?_expand=role&_expand=category `).then(res => {
            // console.log(NewsForm.current);
            // console.log(res.data);
            const { title, categoryId, content } = res.data;
            NewsForm.current.setFieldsValue({  //填写新闻标题和新闻分类
                title,
                categoryId
            })
            setContent(content);
        }).catch(err => { console.log(err); })
    }, [Parms.id])

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() => { navigate(-1) }}
            />

            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>

            <div style={{ margin: '50px 0 0 0' }}>
                <div style={{ display: current === 0 ? '' : 'none' }}>
                    <Form {...layout} name="control-hooks" ref={NewsForm}>
                        <Form.Item
                            name="title"
                            label="新闻标题"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="新闻分类"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                placeholder="">
                                {
                                    categoryList.map(item => {
                                        return <Option key={item.id} value={item.id} >{item.title} </Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </ Form>
                </div>
                <div style={{ display: current === 1 ? '' : 'none' }}>
                    <NewsEdtior getContent={(value) => {
                        // console.log(value);
                        setContent(value);
                    }} content={content} />
                </div>
                <div style={{ display: current === 2 ? '' : 'none' }}>3333333333</div>
            </div>

            <div style={{ margin: '50px 0 0 0 ' }}>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => { handleupdate(0, 'bottomRight') }}>保存草稿箱 </Button>
                        <Button danger onClick={() => { handleupdate(1, 'topRigbottomRightht') }}>提交</Button>
                    </span>
                }
                {current < 2 && <Button type='primary' onClick={() => { handlenext() }}>下一步</Button>}
                {current > 0 && <Button type='primary' onClick={() => { handleprevious() }}>上一步</Button>}
            </div>

        </div >
    )
}

export default NewsUpdate