import React from 'react';
import usePublish from '../../../component/publish-manage/usePublish';
import NewsPublish from '../../../component/publish-manage/NewsPublish'
import { Button } from 'antd';

function Unpublish() {
  const { dataSource, handlePublish } = usePublish(1)
  return (
    <NewsPublish dataSource={dataSource}
      button={(id) => <Button type='primary'
        onClick={() => { handlePublish(id) }}>发布</Button>}
    ></NewsPublish>
  )
}

export default Unpublish