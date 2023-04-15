import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { PageHeader, Button, Form, Input, Select, message, notification } from 'antd';
import { Steps } from 'antd';
import NewsEdtior from '../../../component/NewsEdtior'

const { Step } = Steps;
const { Option } = Select;


function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [formInfo, setFormInfo] = useState();
  const [content, setContent] = useState("");
  const NewsForm = useRef(null);
  const userinform = JSON.parse(localStorage.getItem('token'))[0];

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

  const handlesave = (auditState, placement) => {  //保存草稿箱或者提交
    axios.post('/news', {
      "title": formInfo.title,
      "categoryId": formInfo.categoryId,
      "content": content,
      "region": userinform.region ? userinform.region : '全球',
      "author": userinform.username,
      "roleId": userinform.roleId,
      "auditState": auditState,
      "publishState": 0,
      "createTime": Date.now(),
      "star": 0,
      "view": 0,
      "publishTime": 0
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

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
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
          }} />
        </div>
        <div style={{ display: current === 2 ? '' : 'none' }}>
        </div>
      </div>

      <div style={{ margin: '50px 0 0 0 ' }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => { handlesave(0, 'bottomRight') }}>保存草稿箱 </Button>
            <Button danger onClick={() => { handlesave(1, 'topRigbottomRightht') }}>提交</Button>
          </span>
        }
        {current < 2 && <Button type='primary' onClick={() => { handlenext() }}>下一步</Button>}
        {current > 0 && <Button type='primary' onClick={() => { handleprevious() }}>上一步</Button>}
      </div>

    </div >
  )
}

export default NewsAdd