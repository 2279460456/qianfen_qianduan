import React from 'react';
import usePublish from '../../../component/publish-manage/usePublish';
import NewsPublish from '../../../component/publish-manage/NewsPublish'
import { Button } from 'antd';

function Unpublish() {
  const { dataSource, handleDelete } = usePublish(3)
  return (
    <NewsPublish dataSource={dataSource}
      button={(id) => <Button type='danger'
        onClick={() => { handleDelete(id) }} >删除</Button>}></NewsPublish>
  )
}

export default Unpublish