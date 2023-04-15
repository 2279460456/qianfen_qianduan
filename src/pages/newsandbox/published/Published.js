import React from 'react';
import usePublish from '../../../component/publish-manage/usePublish';
import NewsPublish from '../../../component/publish-manage/NewsPublish'
import { Button } from 'antd';

function Unpublish() {
  const { dataSource, handleSunset } = usePublish(2)
  return (
    <NewsPublish dataSource={dataSource}
      button={(id) => <Button type='primary'
        onClick={() => { handleSunset(id) }}>下线</Button>}></NewsPublish>
  )
}

export default Unpublish